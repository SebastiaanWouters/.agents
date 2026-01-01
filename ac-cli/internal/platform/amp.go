package platform

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/sebastiaanwouters/ac-cli/internal/config"
	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
)

type AmpPlatform struct {
	*BasePlatform
}

func NewAmpPlatform() *AmpPlatform {
	return &AmpPlatform{
		BasePlatform: NewBasePlatform(
			"amp",
			"AGENTS.md",
			".agents/skills",
			"~/.config/agents/skills",
			"",
			true,
			false,
		),
	}
}

func (p *AmpPlatform) CopySubagent(_, _, _ string, _ config.CopyOptions) error {
	fmt.Println("Amp does not support subagents. Skipping subagent copy.")
	return nil
}

func (p *AmpPlatform) Validate(target string) (*config.ValidationResult, error) {
	result, err := p.BasePlatform.Validate(target)
	if err != nil {
		return nil, err
	}

	skillsDir := p.GetSkillPath("", target, false)
	skills, err := fileutil.ListDirs(skillsDir)
	if err != nil {
		return nil, err
	}

	for _, skill := range skills {
		skillPath := p.GetSkillPath(skill, target, false)
		skillMdPath := filepath.Join(skillPath, "SKILL.md")

		if !fileutil.FileExists(skillMdPath) {
			result.Warnings = append(result.Warnings, fmt.Sprintf("Amp skill %s missing SKILL.md", skill))
			continue
		}

		content, err := fileutil.ReadFile(skillMdPath)
		if err != nil {
			return nil, err
		}

		if !strings.HasPrefix(content, "---") {
			result.Warnings = append(result.Warnings, fmt.Sprintf("Amp skill %s missing YAML frontmatter", skill))
		}

		if !strings.Contains(content, "name:") {
			result.Warnings = append(result.Warnings, fmt.Sprintf("Amp skill %s missing 'name' in frontmatter", skill))
		}

		if !strings.Contains(content, "description:") {
			result.Warnings = append(result.Warnings, fmt.Sprintf("Amp skill %s missing 'description' in frontmatter", skill))
		}
	}

	return result, nil
}
