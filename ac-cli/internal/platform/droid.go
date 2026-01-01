package platform

type DroidPlatform struct {
	*BasePlatform
}

func NewDroidPlatform() *DroidPlatform {
	return &DroidPlatform{
		BasePlatform: NewBasePlatform(
			"droid",
			"AGENTS.md",
			".droid/skills",
			"~/.droid/skills",
			"",
			true,
			false,
		),
	}
}
