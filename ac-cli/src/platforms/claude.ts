import { BasePlatform } from './base.js';
import type { CopyOptions } from '../types.js';

export class ClaudePlatform extends BasePlatform {
  name = 'claude';
  configFile = 'CLAUDE.md';
  skillsDir = '.claude/skills';
  userSkillsDir = '~/.claude/skills';
  subagentsDir = '.claude/agents';
  supportsSkills = true;
  supportsSubagents = true;

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
    const sourceSkillPath = `${sourceDir}/${skillName}`;
    const destSkillPath = `${targetDir}/${skillName}`;

    if (options.dryRun) {
      console.log(`[DRY RUN] Would copy Claude skill ${skillName} to ${destSkillPath}`);
      return;
    }

    const exists = await (await import('../utils/file.js')).fileExists(destSkillPath);

    if (exists && options.mergeStrategy === 'skip') {
      console.log(`Skipping Claude skill ${skillName} (already exists)`);
      return;
    }

      if (exists && options.mergeStrategy === 'ask') {
      const answer = await this.askForClaudeMerge(destSkillPath, true);
      if (answer === 'skip') {
        console.log(`Skipping Claude skill ${skillName}`);
        return;
      }
      if (answer === 'overwrite') {
        await this.copySkillDirectory(sourceSkillPath, destSkillPath);
        console.log(`Copied Claude skill ${skillName} (overwritten)`);
        return;
      }
      await this.mergeClaudeSkillDirectories(sourceSkillPath, destSkillPath);
      console.log(`Merged Claude skill ${skillName}`);
      return;
    }

    if (exists && options.mergeStrategy === 'overwrite') {
      await this.copySkillDirectory(sourceSkillPath, destSkillPath);
      console.log(`Copied Claude skill ${skillName} (overwritten)`);
      return;
    }

    if (exists && options.mergeStrategy === 'merge') {
      await this.mergeClaudeSkillDirectories(sourceSkillPath, destSkillPath);
      console.log(`Merged Claude skill ${skillName}`);
      return;
    }

    await this.copySkillDirectory(sourceSkillPath, destSkillPath);
    console.log(`Copied Claude skill ${skillName} to ${destSkillPath}`);
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
        result.warnings.push(`Claude skill ${skill} missing SKILL.md`);
        continue;
      }

      const content = await (await import('../utils/file.js')).readFile(skillMdPath);
      if (!content.startsWith('---')) {
        result.warnings.push(`Claude skill ${skill} missing YAML frontmatter`);
      }

      if (!content.includes('name:')) {
        result.warnings.push(`Claude skill ${skill} missing 'name' in frontmatter`);
      }

      if (!content.includes('description:')) {
        result.warnings.push(`Claude skill ${skill} missing 'description' in frontmatter`);
      }
    }

    return result;
  }

  private async copySkillDirectory(source: string, dest: string): Promise<void> {
    const fileUtils = await import('../utils/file.js');
    const fs = await import('fs-extra');
    await fs.copy(source, dest, { overwrite: true });
  }

  private async mergeClaudeSkillDirectories(source: string, dest: string): Promise<void> {
    const fileUtils = await import('../utils/file.js');
    await fileUtils.ensureDir(dest);
    const sourceFiles = await fileUtils.listFiles(source);

    for (const file of sourceFiles) {
      const sourceFile = `${source}/${file}`;
      const destFile = `${dest}/${file}`;

      if (await fileUtils.fileExists(destFile)) {
        await fileUtils.mergeMarkdownFiles(sourceFile, destFile);
      } else {
        await fileUtils.copyFile(sourceFile, destFile);
      }
    }
  }

  private async askForClaudeMerge(
    filePath: string,
    isDir: boolean = false
  ): Promise<'merge' | 'overwrite' | 'skip'> {
    const { askMerge } = await import('../operations/interactive.js');
    return askMerge(filePath, isDir);
  }
}
