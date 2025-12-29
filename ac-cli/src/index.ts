#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';
import { findSourceDir } from './utils/file.js';
import { getPlatform, getPlatformNames, detectAvailableComponents, copyToPlatform, copyToMultiplePlatforms } from './operations/copy.js';
import {
  selectPlatforms,
  selectSkills,
  selectComponents,
  selectTargetDirectory,
  selectMergeStrategy,
  confirmCopy,
  selectUserLevel,
} from './operations/interactive.js';

const program = new Command();

program
  .name('ac')
  .description('Copy agents.md and skills to Claude, Codex, Amp, and OpenCode projects')
  .version('1.0.0');

program
  .command('copy [platforms...]')
  .description('Copy agents.md and skills to specified platforms')
  .option('-t, --target <path>', 'Target project directory')
  .option('-s, --source <path>', 'Source .agents directory')
  .option('-d, --dry-run', 'Preview changes without executing')
  .option('--agents-only', 'Copy only AGENTS.md')
  .option('--skills-only', 'Copy only skills')
  .option('--skill <name>', 'Copy specific skill(s)', (value, previous: string[] = []) => [...previous, value])
  .option('--subagents-only', 'Copy only subagents')
  .option('--merge <strategy>', 'Merge strategy: merge, overwrite, skip, ask', 'ask')
  .option('--user-level', 'Copy to user-level directory (e.g., ~/.claude/skills/)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (platformArgs, options) => {
    try {
      const sourceDir = options.source || (await findSourceDir(process.cwd()));
      if (!sourceDir) {
        console.error(chalk.red('Could not find .agents directory.'));
        console.log(
          chalk.yellow(
            'Please specify a source directory with --source, or run from a directory with .agents/ nearby.'
          )
        );
        process.exit(1);
      }

      console.log(chalk.green(`Found source directory: ${sourceDir}`));

      const components = await detectAvailableComponents(sourceDir);

      if (
        !components.agentsMd &&
        !components.agentsFullMd &&
        components.skills.length === 0 &&
        components.subagents.length === 0
      ) {
        console.error(
          chalk.red('No components found in source directory.')
        );
        process.exit(1);
      }

      const foundItems = [
        components.agentsMd ? 'AGENTS.md' : null,
        components.agentsFullMd ? 'AGENTS-FULL.md' : null,
        components.skills.length > 0 ? `${components.skills.length} skills` : null,
        components.subagents.length > 0 ? `${components.subagents.length} subagents` : null,
      ].filter(Boolean);

      console.log(
        chalk.gray(`Found: ${foundItems.join(', ')}`)
      );

      let targetDir = options.target || process.cwd();
      if (!options.target) {
        targetDir = await selectTargetDirectory(targetDir);
      }

      let platforms: string[] = platformArgs;
      if (platforms.length === 0) {
        console.log(
          chalk.blue('\nAvailable platforms:'),
          getPlatformNames().map((p) => `  - ${p}`).join('\n')
        );
        platforms = await selectPlatforms(getPlatformNames());
      }

      const copyOptions = {
        mergeStrategy: options.merge as 'merge' | 'overwrite' | 'skip' | 'ask',
        dryRun: options.dryRun || false,
        userLevel: options.userLevel || false,
      };

      if (options.userLevel === undefined && !options.target) {
        const userLevelSelected = await selectUserLevel();
        copyOptions.userLevel = userLevelSelected;
      }

      let copyComponents = {
        copyAgents: !options.skillsOnly && !options.subagentsOnly,
        copyAgentsFull: false,
        copySkills: !options.agentsOnly && !options.subagentsOnly,
        copySubagents: !options.agentsOnly && !options.skillsOnly,
        agentsPath: components.agentsMd,
        agentsFullPath: components.agentsFullMd,
        skills: components.skills,
        subagents: components.subagents,
        selectedSkills: options.skill as string[] | undefined,
      };

      if (!options.agentsOnly && !options.skillsOnly && !options.subagentsOnly) {
        const selectedComponents = await selectComponents(
          !!components.agentsMd,
          !!components.agentsFullMd,
          components.skills.length > 0,
          components.subagents.length > 0
        );
        copyComponents = {
          ...copyComponents,
          ...selectedComponents,
        };
      }

      if (copyComponents.copySkills && !copyComponents.selectedSkills && components.skills.length > 0) {
        copyComponents.selectedSkills = await selectSkills(components.skills);
      }

      console.log(chalk.blue('\nCopy options:'));
      console.log(`  Platforms: ${platforms.join(', ')}`);
      console.log(`  Target: ${targetDir}`);
      console.log(`  Merge strategy: ${copyOptions.mergeStrategy}`);
      console.log(
        `  User level: ${copyOptions.userLevel ? 'Yes' : 'No'}`
      );
      console.log(`  Dry run: ${copyOptions.dryRun ? 'Yes' : 'No'}`);

      if (!options.yes) {
        const operations: Array<{
          source: string;
          destination: string;
        }> = [];

        for (const platform of platforms) {
          const p = getPlatform(platform);
          if (!p) continue;

          if (copyComponents.copyAgents && components.agentsMd) {
            operations.push({
              source: components.agentsMd,
              destination: p.getAgentsPath(targetDir),
            });
          }

          if (copyComponents.copyAgentsFull && components.agentsFullMd) {
            operations.push({
              source: components.agentsFullMd,
              destination: p.getAgentsPath(targetDir),
            });
          }

          if (
            copyComponents.copySkills &&
            p.supportsSkills &&
            copyComponents.selectedSkills
          ) {
            for (const skill of copyComponents.selectedSkills) {
              operations.push({
                source: `${sourceDir}/skills/${skill}`,
                destination: p.getSkillPath('', targetDir, copyOptions.userLevel),
              });
            }
          }

          if (
            copyComponents.copySubagents &&
            p.supportsSubagents &&
            components.subagents.length > 0
          ) {
            for (const subagent of components.subagents) {
              operations.push({
                source: `${sourceDir}/subagents/${subagent}.md`,
                destination: `${p.getSubagentsPath(targetDir)}/${subagent}.md`,
              });
            }
          }
        }

        const confirmed = await confirmCopy(operations);
        if (!confirmed) {
          console.log(chalk.yellow('Copy cancelled.'));
          process.exit(0);
        }
      }

      await copyToMultiplePlatforms(
        platforms,
        sourceDir,
        targetDir,
        copyComponents,
        copyOptions
      );

      console.log(chalk.green('\n✓ Copy completed successfully!'));
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available platforms and detect current setup')
  .option('-s, --source <path>', 'Source .agents directory')
  .action(async (options) => {
    const sourceDir = options.source || (await findSourceDir(process.cwd()));

    console.log(chalk.blue('Available platforms:'));
    getPlatformNames().forEach((name) => {
      const platform = getPlatform(name);
      console.log(`  - ${name}`);
      console.log(`    Config: ${platform?.configFile}`);
      console.log(`    Skills: ${platform?.supportsSkills ? 'Yes' : 'No'}`);
      console.log(`    Subagents: ${platform?.supportsSubagents ? 'Yes' : 'No'}`);
    });

    if (sourceDir) {
      console.log(chalk.blue('\nDetected source:'), sourceDir);
      const components = await detectAvailableComponents(sourceDir);

      console.log(chalk.blue('\nAvailable components:'));
      if (components.agentsMd) {
        console.log(`  ✓ AGENTS.md`);
      }
      if (components.agentsFullMd) {
        console.log(`  ✓ AGENTS-FULL.md`);
      }
      if (components.skills.length > 0) {
        console.log(`  ✓ Skills (${components.skills.length}):`);
        components.skills.forEach((skill) => {
          console.log(`    - ${skill}`);
        });
      }
      if (components.subagents.length > 0) {
        console.log(`  ✓ Subagents (${components.subagents.length}):`);
        components.subagents.forEach((subagent) => {
          console.log(`    - ${subagent}`);
        });
      }
    } else {
      console.log(chalk.yellow('\nNo .agents directory found nearby.'));
    }
  });

program
  .command('validate [platform]')
  .description('Validate platform setup')
  .option('-t, --target <path>', 'Target project directory')
  .action(async (platformArg, options) => {
    const targetDir = options.target || process.cwd();
    const platformName = platformArg;

    if (!platformName) {
      console.log(
        chalk.yellow('Please specify a platform to validate.')
      );
      console.log(chalk.blue('Available platforms:'), getPlatformNames().join(', '));
      process.exit(1);
    }

    const platform = getPlatform(platformName);
    if (!platform) {
      console.error(chalk.red(`Unknown platform: ${platformName}`));
      process.exit(1);
    }

    console.log(chalk.blue(`Validating ${platformName} setup at ${targetDir}...`));

    const result = await platform.validate(targetDir);

    if (result.valid) {
      console.log(chalk.green('\n✓ Validation passed!'));
    } else {
      console.log(chalk.red('\n✗ Validation failed!'));
    }

    if (result.errors.length > 0) {
      console.log(chalk.red('\nErrors:'));
      result.errors.forEach((error) => {
        console.log(`  ✗ ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      result.warnings.forEach((warning) => {
        console.log(`  ⚠ ${warning}`);
      });
    }

    process.exit(result.valid ? 0 : 1);
  });

program
  .command('init')
  .description('Initialize default skills and AGENTS.md to ~/.ac')
  .action(async () => {
    try {
      const { ensureDir, copyFile, fileExists, listDirs } = await import('./utils/file.js');
      const path = await import('path');
      const fs = await import('fs-extra');

      const defaultAcDir = process.env.HOME ? `${process.env.HOME}/.ac` : '.ac';

      console.log(chalk.blue(`\nInitializing ac-cli...`));
      console.log(chalk.gray(`Default directory: ${defaultAcDir}\n`));

      // Check if already initialized
      if (await fileExists(defaultAcDir)) {
        const answer = await import('./operations/interactive.js').then(m => m.default.selectInitOverwrite());
        if (!answer) {
          console.log(chalk.yellow('Init cancelled.'));
          process.exit(0);
        }
      }

      await ensureDir(defaultAcDir);

      // Get CLI directory location
      const cliDir = path.default.dirname(path.default.dirname(new URL(import.meta.url).pathname));

      // Copy AGENTS.md if exists in dist
      const agentsPath = path.default.join(cliDir, 'dist', 'AGENTS.md');
      if (await fileExists(agentsPath)) {
        const destPath = path.default.join(defaultAcDir, 'AGENTS.md');
        await fs.copy(agentsPath, destPath, { overwrite: true });
        console.log(chalk.green('✓ Copied AGENTS.md'));
      }

      // Copy AGENTS-FULL.md if exists
      const agentsFullPath = path.default.join(cliDir, 'dist', 'AGENTS-FULL.md');
      if (await fileExists(agentsFullPath)) {
        const destPath = path.default.join(defaultAcDir, 'AGENTS-FULL.md');
        await fs.copy(agentsFullPath, destPath, { overwrite: true });
        console.log(chalk.green('✓ Copied AGENTS-FULL.md'));
      }

      // Copy skills directory if exists
      const skillsSourcePath = path.default.join(cliDir, 'dist', 'bundled');
      if (await fileExists(skillsSourcePath)) {
        const skillsDestPath = path.default.join(defaultAcDir, 'skills');
        await ensureDir(skillsDestPath);

        const skills = await listDirs(skillsSourcePath);
        for (const skill of skills) {
          const skillSource = path.default.join(skillsSourcePath, skill);
          const skillDest = path.default.join(skillsDestPath, skill);
          await fs.copy(skillSource, skillDest, { overwrite: true });
          console.log(chalk.green(`✓ Copied skill: ${skill}`));
        }

        if (skills.length === 0) {
          console.log(chalk.gray('(No skills found in bundled directory)'));
        }
      } else {
        console.log(chalk.yellow('No bundled skills found'));
      }

      console.log('');
      console.log(chalk.green('✓ ac-cli initialized successfully!'));
      console.log(chalk.gray(`Default source: ${defaultAcDir}`));
      console.log(chalk.blue('\nRun "ac copy" to copy skills to platforms.\n'));
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.action(() => {
  program.help();
});

program.action(() => {
  program.help();
});

program.parse();
