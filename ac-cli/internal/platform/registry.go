package platform

import (
	"fmt"
	"path/filepath"
	"sync"

	"github.com/sebastiaanwouters/ac-cli/internal/config"
	"github.com/sebastiaanwouters/ac-cli/internal/fileutil"
)

var (
	registry map[string]config.Platform
	once     sync.Once
)

func initRegistry() {
	registry = map[string]config.Platform{
		"claude":   NewClaudePlatform(),
		"amp":      NewAmpPlatform(),
		"codex":    NewCodexPlatform(),
		"opencode": NewOpenCodePlatform(),
		"droid":    NewDroidPlatform(),
	}
}

func Get(name string) (config.Platform, error) {
	once.Do(initRegistry)

	p, ok := registry[name]
	if !ok {
		return nil, fmt.Errorf("unknown platform: %s", name)
	}

	return p, nil
}

func GetAll() []config.Platform {
	once.Do(initRegistry)

	platforms := make([]config.Platform, 0, len(registry))
	for _, p := range registry {
		platforms = append(platforms, p)
	}

	return platforms
}

func GetNames() []string {
	once.Do(initRegistry)

	names := make([]string, 0, len(registry))
	for name := range registry {
		names = append(names, name)
	}

	return names
}

func DetectAvailableComponents(sourceDir string) (*config.AvailableComponents, error) {
	components := &config.AvailableComponents{}

	agentFiles, err := fileutil.FindAgentFiles(sourceDir)
	if err != nil {
		return nil, err
	}
	components.AgentFiles = agentFiles

	skillsDir := filepath.Join(sourceDir, "skills")
	if fileutil.DirExists(skillsDir) {
		skills, err := fileutil.ListDirs(skillsDir)
		if err != nil {
			return nil, err
		}
		components.Skills = skills
	}

	subagentsDir := filepath.Join(sourceDir, "subagents")
	if fileutil.DirExists(subagentsDir) {
		subagents, err := fileutil.ListDirs(subagentsDir)
		if err != nil {
			return nil, err
		}
		components.Subagents = subagents
	}

	return components, nil
}
