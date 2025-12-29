import path from 'path';
import os from 'os';

export function expandUserHome(filePath: string): string {
  if (filePath.startsWith('~')) {
    return filePath.replace('~', os.homedir());
  }
  return filePath;
}

export function getUserHome(): string {
  return os.homedir();
}

export function getConfigDir(base: string): string {
  const configDir =
    process.env.XDG_CONFIG_HOME ||
    path.join(os.homedir(), '.config');
  return path.join(configDir, base);
}

export function isAbsolutePath(filePath: string): boolean {
  return path.isAbsolute(filePath);
}

export function makeRelative(from: string, to: string): string {
  return path.relative(from, to);
}

export function normalizePath(filePath: string): string {
  return path.normalize(filePath);
}
