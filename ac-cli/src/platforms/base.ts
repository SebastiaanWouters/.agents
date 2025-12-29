import type { Platform, CopyOptions, ValidationResult } from '../types.js';
import * as fileUtils from '../utils/file.js';
import * as pathUtils from '../utils/path.js';

export abstract class BasePlatform implements Platform {
  abstract name: string;
  abstract configFile: string;
  abstract skillsDir: string;
  abstract supportsSkills: boolean;
  abstract supportsSubagents: boolean;

  userSkillsDir?: string;
  subagentsDir?: string;

  async copyAgents(
    source: string,
    target: string,
    options: CopyOptions
  ): Promise<void> {
    const agentsPath = this.getAgentsPath(target);
    const exists = await fileUtils.fileExists(agentsPath);

    if (options.dryRun) {
      console.log(`[DRY RUN] Would copy AGENTS.md to ${agentsPath}`);
      return;
    }

    if (exists && options.mergeStrategy === 'skip') {
      console.log(`Skipping ${agentsPath} (already exists)`);
      return;
    }

    if (exists && options.mergeStrategy === 'ask') {
      const answer = await this.askForMerge(agentsPath);
      if (answer === 'skip') {
        console.log(`Skipping ${agentsPath}`);
        return;
      }
      if (answer === 'overwrite') {
        await fileUtils.copyFile(source, agentsPath, true);
        console.log(`Copied AGENTS.md to ${agentsPath} (overwritten)`);
        return;
      }
      // merge
      await fileUtils.mergeMarkdownFiles(source, agentsPath);
      console.log(`Merged AGENTS.md to ${agentsPath}`);
      return;
    }

    if (exists && options.mergeStrategy === 'overwrite') {
      await fileUtils.copyFile(source, agentsPath, true);
      console.log(`Copied AGENTS.md to ${agentsPath} (overwritten)`);
      return;
    }

    if (exists && options.mergeStrategy === 'merge') {
      await fileUtils.mergeMarkdownFiles(source, agentsPath);
      console.log(`Merged AGENTS.md to ${agentsPath}`);
      return;
    }

    await fileUtils.copyFile(source, agentsPath);
    console.log(`Copied AGENTS.md to ${agentsPath}`);
  }

  async copySkill(
    skillName: string,
    sourceDir: string,
    targetDir: string,
    options: CopyOptions
  ): Promise<void> {
    const sourceSkillPath = fileUtils.joinPath(sourceDir, skillName);
    const destSkillPath = fileUtils.joinPath(targetDir, skillName);
    const exists = await fileUtils.fileExists(destSkillPath);

    if (options.dryRun) {
      console.log(`[DRY RUN] Would copy skill ${skillName} to ${destSkillPath}`);
      return;
    }

    if (exists && options.mergeStrategy === 'skip') {
      console.log(`Skipping skill ${skillName} (already exists)`);
      return;
    }

    if (exists && options.mergeStrategy === 'ask') {
      const answer = await this.askForMerge(destSkillPath, true);
      if (answer === 'skip') {
        console.log(`Skipping skill ${skillName}`);
        return;
      }
      if (answer === 'overwrite') {
        await fileUtils.copyFile(sourceSkillPath, destSkillPath, true);
        console.log(`Copied skill ${skillName} (overwritten)`);
        return;
      }
      // merge
      await this.mergeSkillDirectories(sourceSkillPath, destSkillPath);
      console.log(`Merged skill ${skillName}`);
      return;
    }

    if (exists && options.mergeStrategy === 'overwrite') {
      await fileUtils.copyFile(sourceSkillPath, destSkillPath, true);
      console.log(`Copied skill ${skillName} (overwritten)`);
      return;
    }

    if (exists && options.mergeStrategy === 'merge') {
      await this.mergeSkillDirectories(sourceSkillPath, destSkillPath);
      console.log(`Merged skill ${skillName}`);
      return;
    }

    await fileUtils.copyFile(sourceSkillPath, destSkillPath);
    console.log(`Copied skill ${skillName} to ${destSkillPath}`);
  }

  async copySubagent(
    agentName: string,
    sourceDir: string,
    targetDir: string,
    options: CopyOptions
  ): Promise<void> {
    const sourceAgentPath = fileUtils.joinPath(sourceDir, `${agentName}.md`);
    const destAgentPath = fileUtils.joinPath(targetDir, `${agentName}.md`);
    const exists = await fileUtils.fileExists(destAgentPath);

    if (options.dryRun) {
      console.log(`[DRY RUN] Would copy subagent ${agentName} to ${destAgentPath}`);
      return;
    }

    if (exists && options.mergeStrategy === 'skip') {
      console.log(`Skipping subagent ${agentName} (already exists)`);
      return;
    }

    if (exists && options.mergeStrategy === 'ask') {
      const answer = await this.askForMerge(destAgentPath);
      if (answer === 'skip') {
        console.log(`Skipping subagent ${agentName}`);
        return;
      }
      if (answer === 'overwrite') {
        await fileUtils.copyFile(sourceAgentPath, destAgentPath, true);
        console.log(`Copied subagent ${agentName} (overwritten)`);
        return;
      }
      // merge
      await fileUtils.mergeMarkdownFiles(sourceAgentPath, destAgentPath);
      console.log(`Merged subagent ${agentName}`);
      return;
    }

    if (exists && options.mergeStrategy === 'overwrite') {
      await fileUtils.copyFile(sourceAgentPath, destAgentPath, true);
      console.log(`Copied subagent ${agentName} (overwritten)`);
      return;
    }

    if (exists && options.mergeStrategy === 'merge') {
      await fileUtils.mergeMarkdownFiles(sourceAgentPath, destAgentPath);
      console.log(`Merged subagent ${agentName}`);
      return;
    }

    await fileUtils.copyFile(sourceAgentPath, destAgentPath);
    console.log(`Copied subagent ${agentName} to ${destAgentPath}`);
  }

  async validate(target: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const configPath = this.getAgentsPath(target);
    if (await fileUtils.fileExists(configPath)) {
      const content = await fileUtils.readFile(configPath);
      if (content.length === 0) {
        warnings.push(`${configPath} exists but is empty`);
      }
    }

    if (this.supportsSkills) {
      const skillsDir = this.getSkillPath('', target, false);
      if (!(await fileUtils.fileExists(skillsDir))) {
        warnings.push(`Skills directory does not exist: ${skillsDir}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  getSkillPath(skillName: string, target: string, userLevel: boolean): string {
    const baseDir = userLevel && this.userSkillsDir
      ? pathUtils.expandUserHome(this.userSkillsDir)
      : fileUtils.joinPath(target, this.skillsDir);

    return skillName
      ? fileUtils.joinPath(baseDir, skillName)
      : baseDir;
  }

  getAgentsPath(target: string): string {
    return fileUtils.joinPath(target, this.configFile);
  }

  getSubagentsPath(target: string): string {
    return this.subagentsDir
      ? fileUtils.joinPath(target, this.subagentsDir)
      : '';
  }

  private async mergeSkillDirectories(source: string, dest: string): Promise<void> {
    await fileUtils.ensureDir(dest);
    const sourceFiles = await fileUtils.listFiles(source);

    for (const file of sourceFiles) {
      const sourceFile = fileUtils.joinPath(source, file);
      const destFile = fileUtils.joinPath(dest, file);

      if (await fileUtils.fileExists(destFile)) {
        await fileUtils.mergeMarkdownFiles(sourceFile, destFile);
      } else {
        await fileUtils.copyFile(sourceFile, destFile);
      }
    }
  }

  private async askForMerge(
    filePath: string,
    isDir: boolean = false
  ): Promise<'merge' | 'overwrite' | 'skip'> {
    const { askMerge } = await import('../operations/interactive.js');
    return askMerge(filePath, isDir);
  }
}
