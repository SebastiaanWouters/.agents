import { BasePlatform } from './base.js';
import type { CopyOptions } from '../types.js';

export class AmpPlatform extends BasePlatform {
  name = 'amp';
  configFile = 'AGENTS.md';
  skillsDir = '.agents/skills';
  userSkillsDir = '~/.config/agents/skills';
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
    console.log('Amp does not support subagents. Skipping subagent copy.');
  }

  async validate(target: string) {
    const result = await super.validate(target);

    const skillsDir = this.getSkillPath('', target, false);
    const skills = await (await import('../utils/file.js')).listDirs(skillsDir);

    for (const skill of skills) {
      const skillPath = this.getSkillPath(skill, target, false);
      const skillMdPath = `${skillPath}/SKILL.md`;

      const fileExists = await (await import('../utils/file.js')).fileExists(skillMdPath);
      if (!fileExists) {
        result.warnings.push(`Amp skill ${skill} missing SKILL.md`);
        continue;
      }

      const content = await (await import('../utils/file.js')).readFile(skillMdPath);
      if (!content.startsWith('---')) {
        result.warnings.push(`Amp skill ${skill} missing YAML frontmatter`);
      }

      if (!content.includes('name:')) {
        result.warnings.push(`Amp skill ${skill} missing 'name' in frontmatter`);
      }

      if (!content.includes('description:')) {
        result.warnings.push(`Amp skill ${skill} missing 'description' in frontmatter`);
      }
    }

    return result;
  }
}
