package platform

import (
	"fmt"

	"github.com/sebastiaanwouters/ac-cli/internal/config"
)

type CodexPlatform struct {
	*BasePlatform
}

func NewCodexPlatform() *CodexPlatform {
	return &CodexPlatform{
		BasePlatform: NewBasePlatform(
			"codex",
			"AGENTS.md",
			".codex/skills",
			"~/.codex/skills",
			"",
			false,
			false,
		),
	}
}

func (p *CodexPlatform) CopySkill(_, _, _ string, _ config.CopyOptions) error {
	fmt.Println("Codex does not support skills. Skipping skill copy.")
	return nil
}

func (p *CodexPlatform) CopySubagent(_, _, _ string, _ config.CopyOptions) error {
	fmt.Println("Codex does not support subagents. Skipping subagent copy.")
	return nil
}
