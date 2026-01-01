package cli

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize default skills and AGENTS.md to ~/.ac",
	RunE:  runInit,
}

func runInit(cmd *cobra.Command, args []string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	defaultAcDir := filepath.Join(homeDir, ".ac")

	fmt.Printf("\nInitializing ac-cli...\n")
	fmt.Printf("Default directory: %s\n\n", defaultAcDir)

	if fileutil.DirExists(defaultAcDir) {
		fmt.Printf("~/.ac directory already exists. Overwrite? [y/N]: ")
		var answer string
		if _, err := fmt.Scanf("%s", &answer); err != nil {
			return err
		}
		if answer != "y" && answer != "Y" {
			fmt.Println("Init cancelled.")
			return nil
		}
	}

	if err := fileutil.EnsureDir(defaultAcDir); err != nil {
		return err
	}

	cliDir, err := os.Getwd()
	if err != nil {
		return err
	}

	agentFiles, err := fileutil.FindAgentFiles(cliDir)
	if err != nil {
		return err
	}

	for _, file := range agentFiles {
		srcPath := filepath.Join(cliDir, file)
		destPath := filepath.Join(defaultAcDir, file)
		if err := fileutil.CopyFile(srcPath, destPath, true); err != nil {
			return err
		}
		fmt.Printf("✓ Copied %s\n", file)
	}

	skillsSourceDir := filepath.Join(cliDir, "skills")
	if fileutil.DirExists(skillsSourceDir) {
		skillsDestDir := filepath.Join(defaultAcDir, "skills")
		if err := fileutil.EnsureDir(skillsDestDir); err != nil {
			return err
		}

		skills, err := fileutil.ListDirs(skillsSourceDir)
		if err != nil {
			return err
		}

		for _, skill := range skills {
			skillSource := filepath.Join(skillsSourceDir, skill)
			skillDest := filepath.Join(skillsDestDir, skill)
			if err := fileutil.CopyDir(skillSource, skillDest); err != nil {
				return err
			}
			fmt.Printf("✓ Copied skill: %s\n", skill)
		}

		if len(skills) == 0 {
			fmt.Println("(No skills found in skills directory)")
		}
	} else {
		fmt.Println("No skills directory found")
	}

	fmt.Println("\n✓ ac-cli initialized successfully!")
	fmt.Printf("Default source: %s\n", defaultAcDir)
	fmt.Println("\nRun \"ac copy\" to copy skills to platforms.\n")

	return nil
}
