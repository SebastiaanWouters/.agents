package config

type MergeStrategy string

const (
	MergeStrategyMerge     MergeStrategy = "merge"
	MergeStrategyOverwrite MergeStrategy = "overwrite"
	MergeStrategySkip      MergeStrategy = "skip"
	MergeStrategyAsk       MergeStrategy = "ask"
)

type CopyOptions struct {
	MergeStrategy MergeStrategy
	DryRun        bool
	UserLevel     bool
}

type Platform interface {
	Name() string
	ConfigFile() string
	SkillsDir() string
	UserSkillsDir() string
	SubagentsDir() string
	SupportsSkills() bool
	SupportsSubagents() bool

	CopyAgents(source string, target string, opts CopyOptions) error
	CopySkill(skillName string, sourceDir string, targetDir string, opts CopyOptions) error
	CopySubagent(agentName string, sourceDir string, targetDir string, opts CopyOptions) error
	Validate(target string) (*ValidationResult, error)
	GetSkillPath(skillName string, target string, userLevel bool) string
	GetAgentsPath(target string) string
	GetSubagentsPath(target string) string
}

type ValidationResult struct {
	Valid    bool
	Errors   []string
	Warnings []string
}

type FileInfo struct {
	Source      string
	Destination string
	Exists      bool
	Action      string
}

type AvailableComponents struct {
	AgentFiles []string
	Skills     []string
	Subagents  []string
}
