export type MergeStrategy = 'merge' | 'overwrite' | 'skip' | 'ask';

export interface CopyOptions {
  mergeStrategy: MergeStrategy;
  dryRun: boolean;
  userLevel: boolean;
}

export interface Platform {
  name: string;
  configFile: string;
  skillsDir: string;
  userSkillsDir?: string;
  supportsSkills: boolean;
  supportsSubagents: boolean;

  copyAgents(source: string, target: string, options: CopyOptions): Promise<void>;
  copySkill(skillName: string, sourceDir: string, targetDir: string, options: CopyOptions): Promise<void>;
  copySubagent(agentName: string, sourceDir: string, targetDir: string, options: CopyOptions): Promise<void>;
  validate(target: string): Promise<ValidationResult>;
  getSkillPath(skillName: string, target: string, userLevel: boolean): string;
  getAgentsPath(target: string): string;
  getSubagentsPath(target: string): string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileInfo {
  source: string;
  destination: string;
  exists: boolean;
  action: 'copy' | 'merge' | 'skip' | 'overwrite';
}

export interface AvailableComponents {
  agentsMd: string | null;
  agentsFullMd: string | null;
  skills: string[];
  subagents: string[];
}
