import inquirer from 'inquirer';

export type MergeAnswer = 'merge' | 'overwrite' | 'skip';

export async function askMerge(
  filePath: string,
  isDir: boolean = false
): Promise<MergeAnswer> {
  const { answer } = await inquirer.prompt([
    {
      type: 'list',
      name: 'answer',
      message: `${isDir ? 'Directory' : 'File'} exists: ${filePath}. What do you want to do?`,
      choices: [
        { name: 'Merge', value: 'merge' },
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Skip', value: 'skip' },
      ],
    },
  ]);

  return answer as MergeAnswer;
}

export async function selectPlatforms(
  availablePlatforms: string[]
): Promise<string[]> {
  const { platforms } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Select platforms to copy to:',
      choices: availablePlatforms,
    },
  ]);

  return platforms;
}

export async function selectSkills(
  availableSkills: string[]
): Promise<string[]> {
  const { skills } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'skills',
      message: 'Select skills to copy (press Enter to copy all):',
      choices: availableSkills,
    },
  ]);

  return skills.length > 0 ? skills : availableSkills;
}

export async function selectComponents(
  hasAgents: boolean,
  hasAgentsFull: boolean,
  hasSkills: boolean,
  hasSubagents: boolean
): Promise<{
  copyAgents: boolean;
  copyAgentsFull: boolean;
  copySkills: boolean;
  copySubagents: boolean;
}> {
  const choices = [];

  if (hasAgents) {
    choices.push({ name: 'AGENTS.md', value: 'copyAgents', checked: true });
  }

  if (hasAgentsFull) {
    choices.push({
      name: 'AGENTS-FULL.md',
      value: 'copyAgentsFull',
      checked: false,
    });
  }

  if (hasSkills) {
    choices.push({ name: 'Skills', value: 'copySkills', checked: true });
  }

  if (hasSubagents) {
    choices.push({
      name: 'Subagents',
      value: 'copySubagents',
      checked: true,
    });
  }

  const { components } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'components',
      message: 'Select components to copy:',
      choices,
    },
  ]);

  return {
    copyAgents: components.includes('copyAgents'),
    copyAgentsFull: components.includes('copyAgentsFull'),
    copySkills: components.includes('copySkills'),
    copySubagents: components.includes('copySubagents'),
  };
}

export async function selectTargetDirectory(
  defaultDir: string
): Promise<string> {
  const { targetDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetDir',
      message: 'Target project directory:',
      default: defaultDir,
    },
  ]);

  return targetDir;
}

export async function selectMergeStrategy(): Promise<
  'merge' | 'overwrite' | 'skip' | 'ask'
> {
  const { strategy } = await inquirer.prompt([
    {
      type: 'list',
      name: 'strategy',
      message: 'How to handle existing files?',
      choices: [
        {
          name: 'Ask for each file (default)',
          value: 'ask',
        },
        { name: 'Merge content', value: 'merge' },
        { name: 'Overwrite existing', value: 'overwrite' },
        { name: 'Skip existing', value: 'skip' },
      ],
    },
  ]);

  return strategy;
}

export async function confirmCopy(
  operations: Array<{ source: string; destination: string }>
): Promise<boolean> {
  console.log('\nOperations to be performed:');
  for (const op of operations) {
    console.log(`  ${op.source} -> ${op.destination}`);
  }

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed with copy?',
      default: true,
    },
  ]);

  return confirmed;
}

export async function selectUserLevel(): Promise<boolean> {
  const { userLevel } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'userLevel',
      message: 'Copy to user-level directory (e.g., ~/.claude/skills/)?',
      default: false,
    },
  ]);

  return userLevel;
}

export async function selectInitOverwrite(): Promise<boolean> {
  const { overwrite } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: '~/.ac directory already exists. Overwrite?',
      default: false,
    },
  ]);

  return overwrite;
}
