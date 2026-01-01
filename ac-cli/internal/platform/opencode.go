package platform

import (
	"github.com/sebastiaanwouters/ac-cli/internal/config"
)

type OpenCodePlatform struct {
	*BasePlatform
}

func NewOpenCodePlatform() *OpenCodePlatform {
	return &OpenCodePlatform{
		BasePlatform: NewBasePlatform(
			"opencode",
			"AGENTS.md",
			".opencode/skill",
			"",
			"",
			true,
			false,
		),
	}
}

func (p *OpenCodePlatform) CopySubagent(_, _, _ string, _ config.CopyOptions) error {
	return nil
}
