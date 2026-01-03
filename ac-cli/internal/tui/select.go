package tui

import (
	"fmt"

	"github.com/charmbracelet/huh"
	"github.com/sebastiaanwouters/ac-cli/internal/config"
)

// SelectPlatform prompts user to select a platform from available options
func SelectPlatform(platforms []string) (string, error) {
	var selected string

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title("Select a platform").
				Description("Choose destination platform for copying").
				Options(huh.NewOptions(platforms...)...).
				Value(&selected),
		),
	).WithTheme(huh.ThemeCatppuccin())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("failed to select platform: %w", err)
	}

	return selected, nil
}

// SelectAgentFile prompts user to select one AGENTS.md file
func SelectAgentFile(files []string) (string, error) {
	var selected string

	options := make([]huh.Option[string], len(files))
	for i, file := range files {
		options[i] = huh.NewOption(file, file)
	}

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title("Select AGENTS file").
				Description("Choose which agent configuration file to copy").
				Options(options...).
				Value(&selected),
		),
	).WithTheme(huh.ThemeCatppuccin())

	if err := form.Run(); err != nil {
		return "", fmt.Errorf("failed to select agent file: %w", err)
	}

	return selected, nil
}

// SelectSkills prompts user to select multiple skills (all selected by default)
func SelectSkills(skills []string) ([]string, error) {
	selected := make([]string, len(skills))
	copy(selected, skills)

	options := make([]huh.Option[string], len(skills))
	for i, skill := range skills {
		options[i] = huh.NewOption(skill, skill).Selected(true)
	}

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewMultiSelect[string]().
				Title("Select skills to copy").
				Description("Space to toggle, Enter to confirm (all selected by default)").
				Options(options...).
				Value(&selected),
		),
	).WithTheme(huh.ThemeCatppuccin())

	if err := form.Run(); err != nil {
		return nil, fmt.Errorf("failed to select skills: %w", err)
	}

	return selected, nil
}

// ConfirmOverwrite asks user if they want to overwrite an existing file
func ConfirmOverwrite(filePath string) (bool, error) {
	var confirmed bool

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewConfirm().
				Title("File already exists").
				Description(fmt.Sprintf("Overwrite %s?", filePath)).
				Value(&confirmed),
		),
	).WithTheme(huh.ThemeCatppuccin())

	if err := form.Run(); err != nil {
		return false, fmt.Errorf("failed to confirm overwrite: %w", err)
	}

	return confirmed, nil
}

// ConfirmCopy shows summary and asks for final confirmation
func ConfirmCopy(platforms []string, target string, agentFile string, skillCount int, strategy config.MergeStrategy) (bool, error) {
	var confirmed bool

	summary := "\nOperations to be performed:\n"
	for _, p := range platforms {
		summary += fmt.Sprintf("  Platform: %s\n", p)
		summary += fmt.Sprintf("    Target: %s\n", target)
		summary += fmt.Sprintf("    Merge strategy: %s\n", strategy)
	}

	if agentFile != "" {
		summary += fmt.Sprintf("  Agent file: %s\n", agentFile)
	}

	if skillCount > 0 {
		summary += fmt.Sprintf("  Skills: %d selected\n", skillCount)
	}

	fmt.Println(summary)

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewConfirm().
				Title("Confirm copy").
				Description("Proceed with the copy operation?").
				Value(&confirmed),
		),
	).WithTheme(huh.ThemeCatppuccin())

	if err := form.Run(); err != nil {
		return false, fmt.Errorf("failed to confirm copy: %w", err)
	}

	return confirmed, nil
}
