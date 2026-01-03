package cli

import (
	"fmt"
	"path/filepath"

	"github.com/sebastiaanwouters/ac-cli/internal/config"
	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
	"github.com/sebastiaanwouters/ac-cli/internal/platform"
	"github.com/sebastiaanwouters/ac-cli/internal/tui"
	"github.com/spf13/cobra"
)

type CopyFlags struct {
	Target     string
	Source     string
	DryRun     bool
	AgentsOnly bool
	SkillsOnly bool
	AgentFiles []string
	Skills     []string
	Merge      string
	UserLevel  bool
}

var copyFlags = &CopyFlags{}

var copyCmd = &cobra.Command{
	Use:   "copy [platforms...]",
	Short: "Copy AGENTS.md and skills to specified platforms",
	Example: `  ac copy claude
  ac copy claude opencode amp
  ac copy claude --target /path/to/project
  ac copy claude --skill plan --skill review
  ac copy claude --agent-file AGENTS_100X.md`,
	RunE: runCopy,
}

func init() {
	copyCmd.Flags().StringVarP(&copyFlags.Target, "target", "t", "", "Target project directory")
	copyCmd.Flags().StringVarP(&copyFlags.Source, "source", "s", "", "Source .agents directory")
	copyCmd.Flags().BoolVar(&copyFlags.DryRun, "dry-run", false, "Preview changes without executing")
	copyCmd.Flags().BoolVar(&copyFlags.AgentsOnly, "agents-only", false, "Copy only AGENTS.md files")
	copyCmd.Flags().BoolVar(&copyFlags.SkillsOnly, "skills-only", false, "Copy only skills")
	copyCmd.Flags().StringSliceVar(&copyFlags.AgentFiles, "agent-file", nil, "Specific AGENTS.md files to copy")
	copyCmd.Flags().StringSliceVarP(&copyFlags.Skills, "skill", "k", nil, "Copy specific skill(s)")
	copyCmd.Flags().StringVar(&copyFlags.Merge, "merge", "ask", "Merge strategy: overwrite, skip, ask")
	copyCmd.Flags().BoolVar(&copyFlags.UserLevel, "user-level", false, "Copy to user-level directory")
}

func runCopy(cmd *cobra.Command, args []string) error {
	sourceDir := copyFlags.Source
	if sourceDir == "" {
		var err error
		sourceDir, err = fileutil.FindSourceDir(fileutil.Resolve("."))
		if err != nil {
			return fmt.Errorf("could not find .agents directory. Please specify --source")
		}
	}

	fmt.Printf("Found source directory: %s\n", sourceDir)

	components, err := platform.DetectAvailableComponents(sourceDir)
	if err != nil {
		return err
	}

	if !hasComponents(components) {
		return fmt.Errorf("no components found in source directory")
	}

	printFoundComponents(components)

	targetDir := copyFlags.Target
	if targetDir == "" {
		targetDir = fileutil.Resolve(".")
	}

	platforms := args
	if len(platforms) == 0 {
		platform, err := tui.SelectPlatform(platform.GetNames())
		if err != nil {
			return err
		}
		platforms = []string{platform}
	}

	mergeStrategy := config.MergeStrategy(copyFlags.Merge)
	if mergeStrategy != config.MergeStrategyOverwrite &&
		mergeStrategy != config.MergeStrategySkip &&
		mergeStrategy != config.MergeStrategyAsk {
		return fmt.Errorf("invalid merge strategy: %s", copyFlags.Merge)
	}

	opts := config.CopyOptions{
		MergeStrategy: mergeStrategy,
		DryRun:        copyFlags.DryRun,
		UserLevel:     copyFlags.UserLevel,
	}

	copyAgents := !copyFlags.SkillsOnly
	copySkills := !copyFlags.AgentsOnly

	selectedAgentFile, err := selectAgentFile(components.AgentFiles, copyAgents, copyFlags.AgentFiles, false)
	if err != nil {
		return err
	}

	selectedSkills := copyFlags.Skills
	if copySkills && len(selectedSkills) == 0 {
		selectedSkills, err = tui.SelectSkills(components.Skills)
		if err != nil {
			return err
		}
	}

	confirmed, err := tui.ConfirmCopy(platforms, targetDir, selectedAgentFile, len(selectedSkills), opts.MergeStrategy)
	if err != nil {
		return err
	}
	if !confirmed {
		fmt.Println("Copy cancelled.")
		return nil
	}

	for _, platformName := range platforms {
		p, err := platform.Get(platformName)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			continue
		}

		fmt.Printf("\nCopying to %s...\n", p.Name())

		if selectedAgentFile != "" {
			sourcePath := filepath.Join(sourceDir, selectedAgentFile)
			if err := p.CopyAgents(sourcePath, targetDir, opts); err != nil {
				return err
			}
		}

		if copySkills && p.SupportsSkills() && len(selectedSkills) > 0 {
			targetSkillsDir := p.GetSkillPath("", targetDir, opts.UserLevel)
			sourceSkillsDir := filepath.Join(sourceDir, "skills")

			if err := fileutil.EnsureDir(targetSkillsDir); err != nil {
				return err
			}

			for _, skill := range selectedSkills {
				if err := p.CopySkill(skill, sourceSkillsDir, targetSkillsDir, opts); err != nil {
					return err
				}
			}
		}
	}

	fmt.Println("\n✓ Copy completed successfully!")
	return nil
}

func selectAgentFile(files []string, copyAgents bool, agentFiles []string, skipPrompt bool) (string, error) {
	if !copyAgents || len(files) == 0 {
		return "", nil
	}

	if len(agentFiles) > 0 {
		return agentFiles[0], nil
	}

	if len(files) == 1 {
		return files[0], nil
	}

	return tui.SelectAgentFile(files)
}

func hasComponents(components *config.AvailableComponents) bool {
	return len(components.AgentFiles) > 0 ||
		len(components.Skills) > 0 ||
		len(components.Subagents) > 0
}

func printFoundComponents(components *config.AvailableComponents) {
	if len(components.AgentFiles) > 0 {
		fmt.Println("\nFound agent files:")
		for _, file := range components.AgentFiles {
			fmt.Printf("  ✓ %s\n", file)
		}
	}

	if len(components.Skills) > 0 {
		fmt.Printf("\nFound %d skill(s)\n", len(components.Skills))
	}

	if len(components.Subagents) > 0 {
		fmt.Printf("\nFound %d subagent(s)\n", len(components.Subagents))
	}
}
