package cli

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "ac",
	Short: "Copy AGENTS.md and skills to Claude, Codex, Amp, OpenCode, and Droid projects",
	Long: `Copy AGENTS.md and skills to Claude, Codex, Amp, OpenCode, and Droid projects with ease.

Supports multiple platforms, interactive mode, smart merging, and dry run mode.`,
}

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.AddCommand(copyCmd)
	rootCmd.AddCommand(listCmd)
	rootCmd.AddCommand(validateCmd)
	rootCmd.AddCommand(initCmd)
}
