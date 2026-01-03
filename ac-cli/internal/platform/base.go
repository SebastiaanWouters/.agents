package platform

import (
	"fmt"
	"path/filepath"

	"github.com/sebastiaanwouters/ac-cli/internal/config"
	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
	"github.com/sebastiaanwouters/ac-cli/internal/tui"
)

type BasePlatform struct {
	name           string
	configFile     string
	skillsDir      string
	userSkillsDir  string
	subagentsDir   string
	supportsSkills bool
	supportsSub    bool
}

func NewBasePlatform(name, configFile, skillsDir, userSkillsDir, subagentsDir string, supportsSkills, supportsSub bool) *BasePlatform {
	return &BasePlatform{
		name:           name,
		configFile:     configFile,
		skillsDir:      skillsDir,
		userSkillsDir:  userSkillsDir,
		subagentsDir:   subagentsDir,
		supportsSkills: supportsSkills,
		supportsSub:    supportsSub,
	}
}

func (p *BasePlatform) Name() string {
	return p.name
}

func (p *BasePlatform) ConfigFile() string {
	return p.configFile
}

func (p *BasePlatform) SkillsDir() string {
	return p.skillsDir
}

func (p *BasePlatform) UserSkillsDir() string {
	return p.userSkillsDir
}

func (p *BasePlatform) SubagentsDir() string {
	return p.subagentsDir
}

func (p *BasePlatform) SupportsSkills() bool {
	return p.supportsSkills
}

func (p *BasePlatform) SupportsSubagents() bool {
	return p.supportsSub
}

func (p *BasePlatform) CopyAgents(source, target string, opts config.CopyOptions) error {
	agentsPath := p.GetAgentsPath(target)
	sourceBasename := filepath.Base(source)
	exists := fileutil.FileExists(agentsPath)

	if opts.DryRun {
		fmt.Printf("[DRY RUN] Would copy %s to %s\n", sourceBasename, agentsPath)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategySkip {
		fmt.Printf("Skipping %s (already exists)\n", sourceBasename)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategyOverwrite {
		if err := fileutil.CopyFile(source, agentsPath, true); err != nil {
			return err
		}
		fmt.Printf("Copied %s to %s (overwritten)\n", sourceBasename, agentsPath)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategyAsk {
		confirmed, err := tui.ConfirmOverwrite(agentsPath)
		if err != nil {
			return err
		}
		if !confirmed {
			fmt.Printf("Skipping %s\n", sourceBasename)
			return nil
		}
		if err := fileutil.CopyFile(source, agentsPath, true); err != nil {
			return err
		}
		fmt.Printf("Copied %s to %s (overwritten)\n", sourceBasename, agentsPath)
		return nil
	}

	if err := fileutil.CopyFile(source, agentsPath, false); err != nil {
		return err
	}
	fmt.Printf("Copied %s to %s\n", sourceBasename, agentsPath)
	return nil
}

func (p *BasePlatform) CopySkill(skillName, sourceDir, targetDir string, opts config.CopyOptions) error {
	sourceSkillPath := filepath.Join(sourceDir, skillName)
	destSkillPath := filepath.Join(targetDir, skillName)
	exists := fileutil.FileExists(destSkillPath)

	if opts.DryRun {
		fmt.Printf("[DRY RUN] Would copy skill %s to %s\n", skillName, destSkillPath)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategySkip {
		fmt.Printf("Skipping skill %s (already exists)\n", skillName)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategyOverwrite {
		if err := fileutil.CopyDir(sourceSkillPath, destSkillPath); err != nil {
			return err
		}
		fmt.Printf("Copied skill %s (overwritten)\n", skillName)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategyAsk {
		confirmed, err := tui.ConfirmOverwrite(destSkillPath)
		if err != nil {
			return err
		}
		if !confirmed {
			fmt.Printf("Skipping skill %s\n", skillName)
			return nil
		}
		if err := fileutil.CopyDir(sourceSkillPath, destSkillPath); err != nil {
			return err
		}
		fmt.Printf("Copied skill %s (overwritten)\n", skillName)
		return nil
	}

	if err := fileutil.CopyDir(sourceSkillPath, destSkillPath); err != nil {
		return err
	}
	fmt.Printf("Copied skill %s to %s\n", skillName, destSkillPath)
	return nil
}

func (p *BasePlatform) CopySubagent(agentName, sourceDir, targetDir string, opts config.CopyOptions) error {
	sourceAgentPath := filepath.Join(sourceDir, agentName+".md")
	destAgentPath := filepath.Join(targetDir, agentName+".md")
	exists := fileutil.FileExists(destAgentPath)

	if opts.DryRun {
		fmt.Printf("[DRY RUN] Would copy subagent %s to %s\n", agentName, destAgentPath)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategySkip {
		fmt.Printf("Skipping subagent %s (already exists)\n", agentName)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategyOverwrite {
		if err := fileutil.CopyFile(sourceAgentPath, destAgentPath, true); err != nil {
			return err
		}
		fmt.Printf("Copied subagent %s (overwritten)\n", agentName)
		return nil
	}

	if exists && opts.MergeStrategy == config.MergeStrategyAsk {
		confirmed, err := tui.ConfirmOverwrite(destAgentPath)
		if err != nil {
			return err
		}
		if !confirmed {
			fmt.Printf("Skipping subagent %s\n", agentName)
			return nil
		}
		if err := fileutil.CopyFile(sourceAgentPath, destAgentPath, true); err != nil {
			return err
		}
		fmt.Printf("Copied subagent %s (overwritten)\n", agentName)
		return nil
	}

	if err := fileutil.CopyFile(sourceAgentPath, destAgentPath, false); err != nil {
		return err
	}
	fmt.Printf("Copied subagent %s to %s\n", agentName, destAgentPath)
	return nil
}

func (p *BasePlatform) Validate(target string) (*config.ValidationResult, error) {
	result := &config.ValidationResult{
		Valid:    true,
		Errors:   []string{},
		Warnings: []string{},
	}

	configPath := p.GetAgentsPath(target)
	if fileutil.FileExists(configPath) {
		content, err := fileutil.ReadFile(configPath)
		if err != nil {
			return nil, err
		}
		if len(content) == 0 {
			result.Warnings = append(result.Warnings, fmt.Sprintf("%s exists but is empty", configPath))
		}
	}

	if p.supportsSkills {
		skillsDir := p.GetSkillPath("", target, false)
		if !fileutil.DirExists(skillsDir) {
			result.Warnings = append(result.Warnings, fmt.Sprintf("Skills directory does not exist: %s", skillsDir))
		}
	}

	return result, nil
}

func (p *BasePlatform) GetSkillPath(skillName, target string, userLevel bool) string {
	baseDir := target
	if userLevel && p.userSkillsDir != "" {
		baseDir = fileutil.ExpandUserHome(p.userSkillsDir)
	} else {
		baseDir = filepath.Join(target, p.skillsDir)
	}

	if skillName == "" {
		return baseDir
	}
	return filepath.Join(baseDir, skillName)
}

func (p *BasePlatform) GetAgentsPath(target string) string {
	return filepath.Join(target, p.configFile)
}

func (p *BasePlatform) GetSubagentsPath(target string) string {
	if p.subagentsDir == "" {
		return ""
	}
	return filepath.Join(target, p.subagentsDir)
}

