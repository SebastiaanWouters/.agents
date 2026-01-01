package cli

import (
	"fmt"

	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
	"github.com/sebastiaanwouters/ac-cli/internal/platform"
	"github.com/spf13/cobra"
)

var (
	validateTarget string
	validateName   string
)

func init() {
	validateCmd.Flags().StringVarP(&validateTarget, "target", "t", "", "Target project directory")
	validateCmd.Args = cobra.ExactArgs(1)
}

var validateCmd = &cobra.Command{
	Use:   "validate [platform]",
	Short: "Validate platform setup",
	Example: `  ac validate claude
  ac validate opencode --target /path/to/project`,
	RunE: runValidate,
}

func runValidate(cmd *cobra.Command, args []string) error {
	platformName := args[0]
	targetDir := validateTarget
	if targetDir == "" {
		targetDir = fileutil.Resolve(".")
	}

	p, err := platform.Get(platformName)
	if err != nil {
		return fmt.Errorf("unknown platform: %s", platformName)
	}

	fmt.Printf("Validating %s setup at %s...\n", p.Name(), targetDir)

	result, err := p.Validate(targetDir)
	if err != nil {
		return err
	}

	if result.Valid {
		fmt.Println("\n✓ Validation passed!")
	} else {
		fmt.Println("\n✗ Validation failed!")
	}

	if len(result.Errors) > 0 {
		fmt.Println("\nErrors:")
		for _, e := range result.Errors {
			fmt.Printf("  ✗ %s\n", e)
		}
	}

	if len(result.Warnings) > 0 {
		fmt.Println("\nWarnings:")
		for _, w := range result.Warnings {
			fmt.Printf("  ⚠ %s\n", w)
		}
	}

	if !result.Valid {
		return fmt.Errorf("validation failed")
	}

	return nil
}
