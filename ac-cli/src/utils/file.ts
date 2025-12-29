import fs from 'fs-extra';
import path from 'path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function copyFile(
  source: string,
  destination: string,
  overwrite: boolean = false
): Promise<void> {
  await fs.ensureDir(path.dirname(destination));
  await fs.copy(source, destination, { overwrite });
}

export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function mergeMarkdownFiles(
  source: string,
  destination: string,
  separator: string = '\n\n---\n\n'
): Promise<void> {
  const sourceContent = await readFile(source);
  let destContent = '';

  if (await fileExists(destination)) {
    destContent = await readFile(destination);
  }

  const mergedContent = destContent
    ? destContent + separator + sourceContent
    : sourceContent;

  await writeFile(destination, mergedContent);
}

export function resolvePath(...paths: string[]): string {
  return path.resolve(...paths);
}

export function joinPath(...paths: string[]): string {
  return path.join(...paths);
}

export function getBasename(filePath: string): string {
  return path.basename(filePath);
}

export function getDirname(filePath: string): string {
  return path.dirname(filePath);
}

export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    return files.filter((file) => !file.startsWith('.'));
  } catch {
    return [];
  }
}

export async function listDirs(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    const dirs: string[] = [];

    for (const file of files) {
      const filePath = joinPath(dirPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory() && !file.startsWith('.')) {
        dirs.push(file);
      }
    }

    return dirs;
  } catch {
    return [];
  }
}

export async function findSourceDir(cwd: string): Promise<string | null> {
  const defaultAcDir = process.env.HOME ? `${process.env.HOME}/.ac` : '.ac';

  if (await fileExists(defaultAcDir)) {
    return resolvePath(defaultAcDir);
  }

  const possiblePaths = [
    joinPath(cwd, '.agents'),
    joinPath(cwd, '..', '.agents'),
    joinPath(cwd, '..', '..', '.agents'),
  ];

  for (const possiblePath of possiblePaths) {
    if (await fileExists(possiblePath)) {
      return resolvePath(possiblePath);
    }
  }

  return null;
}
