import { BasePlatform } from './base.js';
import type { CopyOptions } from '../types.js';

export class CodexPlatform extends BasePlatform {
  name = 'codex';
  configFile = 'AGENTS.md';
  skillsDir = '.codex/skills';
  userSkillsDir = '~/.codex/skills';
  subagentsDir = '';
  supportsSkills = false;
  supportsSubagents = false;

  async copyAgents(
    source: string,
    target: string,
    options: CopyOptions
  ): Promise<void> {
    await super.copyAgents(source, target, options);
  }

  async copySkill(
    _skillName: string,
    _sourceDir: string,
    _targetDir: string,
    _options: CopyOptions
  ): Promise<void> {
    console.log('Codex does not support skills. Skipping skill copy.');
  }

  async copySubagent(
    _agentName: string,
    _sourceDir: string,
    _targetDir: string,
    _options: CopyOptions
  ): Promise<void> {
    console.log('Codex does not support subagents. Skipping subagent copy.');
  }
}
