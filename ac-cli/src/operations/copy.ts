import chalk from 'chalk';
import ora from 'ora';
import { ClaudePlatform } from '../platforms/claude.js';
import { CodexPlatform } from '../platforms/codex.js';
import { AmpPlatform } from '../platforms/amp.js';
import { OpenCodePlatform } from '../platforms/opencode.js';
import type { CopyOptions, Platform, AvailableComponents } from '../types.js';
import * as fileUtils from '../utils/file.js';

const platforms: Record<string, Platform> = {
  claude: new ClaudePlatform(),
  codex: new CodexPlatform(),
  amp: new AmpPlatform(),
  opencode: new OpenCodePlatform(),
};

export function getPlatform(name: string): Platform | undefined {
  return platforms[name.toLowerCase()];
}

export function getAllPlatforms(): Platform[] {
  return Object.values(platforms);
}

export function getPlatformNames(): string[] {
  return Object.keys(platforms);
}

export async function detectAvailableComponents(
  sourceDir: string
): Promise<AvailableComponents> {
  const agentsMdPath = `${sourceDir}/AGENTS.md`;
  const agentsFullMdPath = `${sourceDir}/AGENTS-FULL.md`;
  const skillsDir = `${sourceDir}/skills`;
  const subagentsDir = `${sourceDir}/subagents`;

  return {
    agentsMd: (await fileUtils.fileExists(agentsMdPath)) ? agentsMdPath : null,
    agentsFullMd: (await fileUtils.fileExists(agentsFullMdPath))
      ? agentsFullMdPath
      : null,
    skills: (await fileUtils.fileExists(skillsDir))
      ? await fileUtils.listDirs(skillsDir)
      : [],
    subagents: (await fileUtils.fileExists(subagentsDir))
      ? await fileUtils.listDirs(subagentsDir)
      : [],
  };
}

export async function copyToPlatform(
  platformName: string,
  sourceDir: string,
  targetDir: string,
  components: {
    copyAgents: boolean;
    copyAgentsFull: boolean;
    copySkills: boolean;
    copySubagents: boolean;
    agentsPath?: string | null;
    agentsFullPath?: string | null;
    skills: string[];
    subagents: string[];
    selectedSkills?: string[];
  },
  options: CopyOptions
): Promise<void> {
  const platform = getPlatform(platformName);
  if (!platform) {
    console.error(chalk.red(`Unknown platform: ${platformName}`));
    return;
  }

  const spinner = ora(`Copying to ${platform.name}...`).start();

  try {
    if (components.copyAgents && components.agentsPath) {
      await platform.copyAgents(components.agentsPath, targetDir, options);
    }

    if (components.copyAgentsFull && components.agentsFullPath) {
      await platform.copyAgents(components.agentsFullPath, targetDir, options);
    }

    if (components.copySkills && platform.supportsSkills) {
      const skills = components.selectedSkills || components.skills;
      const targetSkillsDir = platform.getSkillPath('', targetDir, options.userLevel);
      const sourceSkillsDir = `${sourceDir}/skills`;
      await fileUtils.ensureDir(targetSkillsDir);

      for (const skill of skills) {
        await platform.copySkill(skill, sourceSkillsDir, targetSkillsDir, options);
      }
    }

    if (components.copySubagents && platform.supportsSubagents) {
      const targetSubagentsDir = platform.getSubagentsPath(targetDir);
      if (targetSubagentsDir) {
        await fileUtils.ensureDir(targetSubagentsDir);

        for (const subagent of components.subagents) {
          const sourceSubagentDir = `${sourceDir}/subagents/${subagent}`;
          await platform.copySubagent(
            subagent,
            sourceSubagentDir,
            targetSubagentsDir,
            options
          );
        }
      }
    }

    spinner.succeed(`Copied to ${platform.name}`);
  } catch (error) {
    spinner.fail(`Failed to copy to ${platform.name}`);
    throw error;
  }
}

export async function copyToMultiplePlatforms(
  platformNames: string[],
  sourceDir: string,
  targetDir: string,
  components: {
    copyAgents: boolean;
    copyAgentsFull: boolean;
    copySkills: boolean;
    copySubagents: boolean;
    agentsPath?: string | null;
    agentsFullPath?: string | null;
    skills: string[];
    subagents: string[];
    selectedSkills?: string[];
  },
  options: CopyOptions
): Promise<void> {
  for (const platformName of platformNames) {
    await copyToPlatform(
      platformName,
      sourceDir,
      targetDir,
      components,
      options
    );
  }
}
