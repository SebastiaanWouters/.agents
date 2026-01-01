package fileutil

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func FileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func DirExists(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	return info.IsDir()
}

func EnsureDir(path string) error {
	return os.MkdirAll(path, 0755)
}

func CopyFile(src, dst string, overwrite bool) error {
	if !FileExists(src) {
		return fmt.Errorf("source file does not exist: %s", src)
	}

	if FileExists(dst) && !overwrite {
		return nil
	}

	if err := EnsureDir(filepath.Dir(dst)); err != nil {
		return err
	}

	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	if _, err := dstFile.ReadFrom(srcFile); err != nil {
		return err
	}

	return nil
}

func CopyDir(src, dst string) error {
	srcInfo, err := os.Stat(src)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(dst, srcInfo.Mode()); err != nil {
		return err
	}

	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())

		if entry.IsDir() {
			if err := CopyDir(srcPath, dstPath); err != nil {
				return err
			}
		} else {
			if err := CopyFile(srcPath, dstPath, true); err != nil {
				return err
			}
		}
	}

	return nil
}

func ReadFile(path string) (string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

func WriteFile(path, content string) error {
	if err := EnsureDir(filepath.Dir(path)); err != nil {
		return err
	}

	return os.WriteFile(path, []byte(content), 0644)
}

func MergeMarkdownFiles(src, dst string, separator string) error {
	srcContent, err := ReadFile(src)
	if err != nil {
		return err
	}

	var destContent string
	if FileExists(dst) {
		destContent, _ = ReadFile(dst)
	}

	var mergedContent string
	if destContent != "" {
		mergedContent = destContent + separator + srcContent
	} else {
		mergedContent = srcContent
	}

	return WriteFile(dst, mergedContent)
}

func ListFiles(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, err
	}

	var files []string
	for _, entry := range entries {
		if !entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") {
			files = append(files, entry.Name())
		}
	}

	return files, nil
}

func ListDirs(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, err
	}

	var dirs []string
	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") {
			dirs = append(dirs, entry.Name())
		}
	}

	return dirs, nil
}

func FindSourceDir(cwd string) (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	defaultAcDir := filepath.Join(homeDir, ".ac")
	if DirExists(defaultAcDir) {
		return filepath.Abs(defaultAcDir)
	}

	possiblePaths := []string{
		filepath.Join(cwd, ".agents"),
		filepath.Join(cwd, "..", ".agents"),
		filepath.Join(cwd, "..", "..", ".agents"),
	}

	for _, path := range possiblePaths {
		if DirExists(path) {
			return filepath.Abs(path)
		}
	}

	return "", fmt.Errorf("could not find .agents directory")
}

func FindAgentFiles(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, err
	}

	var files []string
	for _, entry := range entries {
		if !entry.IsDir() {
			name := entry.Name()
			if strings.HasPrefix(name, "AGENTS") && strings.HasSuffix(name, ".md") {
				files = append(files, name)
			}
		}
	}

	return files, nil
}

func ExpandUserHome(path string) string {
	homeDir, _ := os.UserHomeDir()
	return strings.Replace(path, "~", homeDir, 1)
}

func IsAbsolute(path string) bool {
	return filepath.IsAbs(path)
}

func Join(elem ...string) string {
	return filepath.Join(elem...)
}

func Resolve(path string) string {
	abs, err := filepath.Abs(path)
	if err != nil {
		return path
	}
	return abs
}

func Basename(path string) string {
	return filepath.Base(path)
}

func Dirname(path string) string {
	return filepath.Dir(path)
}
