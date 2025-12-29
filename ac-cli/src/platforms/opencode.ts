import { BasePlatform } from './base.js';
import type { CopyOptions } from '../types.js';

export class OpenCodePlatform extends BasePlatform {
  name = 'opencode';
  configFile = 'AGENTS.md';
  skillsDir = '.opencode/skill';
  userSkillsDir = '';
  subagentsDir = '';
  supportsSkills = true;
  supportsSubagents = false;

  async copyAgents(
    source: string,
    target: string,
    options: CopyOptions
  ): Promise<void> {
    await super.copyAgents(source, target, options);
  }

  async copySkill(
    skillName: string,
    sourceDir: string,
    targetDir: string,
    options: CopyOptions
  ): Promise<void> {
    await super.copySkill(skillName, sourceDir, targetDir, options);
  }

  async copySubagent(
    _agentName: string,
    _sourceDir: string,
    _targetDir: string,
    _options: CopyOptions
  ): Promise<void> {
    console.log('OpenCode does not support subagents. Skipping subagent copy.');
  }
}
