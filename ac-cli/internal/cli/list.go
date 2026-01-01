package cli

import (
	"fmt"

	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
	"github.com/sebastiaanwouters/ac-cli/internal/platform"
	"github.com/spf13/cobra"
)

var (
	listSource string
)

func init() {
	listCmd.Flags().StringVarP(&listSource, "source", "s", "", "Source .agents directory")
}

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List available platforms and detect current setup",
	RunE:  runList,
}

func runList(cmd *cobra.Command, args []string) error {
	fmt.Println("Available platforms:")
	for _, p := range platform.GetAll() {
		fmt.Printf("  - %s\n", p.Name())
		fmt.Printf("    Config: %s\n", p.ConfigFile())
		fmt.Printf("    Skills: %v\n", p.SupportsSkills())
		fmt.Printf("    Subagents: %v\n", p.SupportsSubagents())
	}

	source := listSource
	if source == "" {
		var err error
		source, err = fileutil.FindSourceDir(fileutil.Resolve("."))
		if err != nil {
			fmt.Println("\nNo .agents directory found nearby.")
			return nil
		}
	}

	fmt.Printf("\nDetected source: %s\n", source)

	components, err := platform.DetectAvailableComponents(source)
	if err != nil {
		return err
	}

	fmt.Println("\nAvailable components:")
	if len(components.AgentFiles) > 0 {
		fmt.Println("  ✓ Agent files:")
		for _, file := range components.AgentFiles {
			fmt.Printf("    - %s\n", file)
		}
	}
	if len(components.Skills) > 0 {
		fmt.Printf("  ✓ Skills (%d):\n", len(components.Skills))
		for _, skill := range components.Skills {
			fmt.Printf("    - %s\n", skill)
		}
	}
	if len(components.Subagents) > 0 {
		fmt.Printf("  ✓ Subagents (%d):\n", len(components.Subagents))
		for _, subagent := range components.Subagents {
			fmt.Printf("    - %s\n", subagent)
		}
	}

	return nil
}
