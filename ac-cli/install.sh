#!/usr/bin/env bash
set -euo pipefail

# Configuration
GITHUB_REPO="sebastiaanwouters/.agents"
INSTALL_DIR="${AC_CLI_INSTALL_DIR:-$HOME/.local/bin}"
BINARY_NAME="ac"

# Colors
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# Logging functions
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

# Cleanup on interrupt
cleanup() {
    local exit_code=$?
    rm -rf "$TMP_DIR" 2>/dev/null || true
    [[ $exit_code -ne 0 ]] && error "Installation interrupted"
    exit $exit_code
}

trap cleanup INT TERM

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect platform
detect_platform() {
    local os arch
    os=$(uname -s)
    arch=$(uname -m)

    case "$os" in
        Darwin) os=darwin ;;
        Linux) os=linux ;;
        *) error "Unsupported OS: $os. Only Linux and macOS are supported." ;;
    esac

    case "$arch" in
        x86_64|amd64) arch=amd64 ;;
        arm64|aarch64) arch=arm64 ;;
        *) error "Unsupported architecture: $arch" ;;
    esac

    echo "${os}-${arch}"
}

# Detect package manager
detect_pkg_manager() {
    if command_exists apt-get; then
        echo "apt"
    elif command_exists yum; then
        echo "yum"
    elif command_exists dnf; then
        echo "dnf"
    elif command_exists pacman; then
        echo "pacman"
    elif command_exists apk; then
        echo "apk"
    else
        echo ""
    fi
}

# Check prerequisites
check_prereqs() {
    local missing=()
    local pkg_manager=$(detect_pkg_manager)

    command_exists curl || command_exists wget || {
        local install_cmd=""
        case "$pkg_manager" in
            apt) install_cmd="sudo apt update && sudo apt install -y curl" ;;
            yum) install_cmd="sudo yum install -y curl" ;;
            dnf) install_cmd="sudo dnf install -y curl" ;;
            pacman) install_cmd="sudo pacman -S curl" ;;
            apk) install_cmd="sudo apk add curl" ;;
        esac
        error "Neither curl nor wget is required. Try:\n  $install_cmd"
    }

    command_exists chmod || missing+=("chmod")
    command_exists mkdir || missing+=("mkdir")

    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Missing required commands: ${missing[*]}"
    fi
}

# Download file with curl or wget
download_file() {
    local url=$1
    local output=$2
    local max_retries=3
    local retry_count=0

    while [[ $retry_count -lt $max_retries ]]; do
        if command_exists curl; then
            local curl_path=$(command -v curl)
            # Check for broken snap curl
            if [[ $curl_path == *"/snap/"* ]]; then
                if command_exists wget; then
                    wget -q --show-progress -O "$output" "$url" && return 0
                else
                    error "curl installed via snap has permission issues. Please reinstall curl or install wget."
                fi
            else
                curl -fsSL --progress-bar --retry 3 -o "$output" "$url" && return 0
            fi
        elif command_exists wget; then
            wget -q --show-progress --tries=3 -O "$output" "$url" && return 0
        else
            error "Neither curl nor wget is available"
        fi

        retry_count=$((retry_count + 1))
        if [[ $retry_count -lt $max_retries ]]; then
            warn "Download failed, retrying ($retry_count/$max_retries)..."
            sleep 1
        fi
    done

    error "Failed to download after $max_retries attempts. Check your network connection and try again."
}

# Download and verify checksum
download_binary() {
    local platform=$1
    local binary_url="https://github.com/${GITHUB_REPO}/releases/latest/download/ac-${platform}"
    local checksum_url="https://github.com/${GITHUB_REPO}/releases/latest/download/ac-${platform}.sha256"
    local tmp_dir="$TMP_DIR"
    local tmp_binary="${tmp_dir}/ac"
    local tmp_checksum="${tmp_dir}/checksum.sha256"

    info "Downloading ac-${platform}..."
    download_file "$binary_url" "$tmp_binary"

    info "Downloading checksum..."
    download_file "$checksum_url" "$tmp_checksum"

    local expected_checksum=$(cat "$tmp_checksum" | cut -d' ' -f1)
    local actual_checksum

    if [[ $(uname -s) == "Darwin" ]]; then
        actual_checksum=$(shasum -a 256 "$tmp_binary" 2>/dev/null || sha256sum "$tmp_binary" 2>/dev/null | cut -d' ' -f1)
    else
        actual_checksum=$(sha256sum "$tmp_binary" 2>/dev/null | cut -d' ' -f1)
    fi

    if [[ -n "$actual_checksum" ]]; then
        info "Verifying checksum..."
        if [[ "$actual_checksum" != "$expected_checksum" ]]; then
            rm -f "$tmp_binary" "$tmp_checksum"
            error "Checksum verification failed!
Expected: $expected_checksum
Actual: $actual_checksum"
        fi
        success "Checksum verified"
    else
        warn "Could not verify checksum (shasum/sha256sum not available)"
        local pkg_manager=$(detect_pkg_manager)
        if [[ -n "$pkg_manager" ]]; then
            info "Install checksum tools:"
            case "$pkg_manager" in
                apt) echo "  sudo apt install -y coreutils" ;;
                yum) echo "  sudo yum install -y coreutils" ;;
                dnf) echo "  sudo dnf install -y coreutils" ;;
                pacman) echo "  sudo pacman -S coreutils" ;;
                apk) echo "  sudo apk add coreutils" ;;
            esac
        fi
    fi

    # Verify binary is valid (not a 404 page or error)
    if ! file "$tmp_binary" 2>/dev/null | grep -qE "(executable|binary|Mach-O|ELF)"; then
        rm -f "$tmp_binary" "$tmp_checksum"
        error "Downloaded file is not a valid binary. This might be a 404 page or download error."
    fi

    chmod +x "$tmp_binary"

    rm -f "$tmp_checksum"
}

# Detect shell
detect_shell() {
    if [[ -n "${SHELL:-}" ]]; then
        basename "$SHELL"
    elif [[ $(uname -s) == "Darwin" ]]; then
        echo "zsh"
    else
        echo "bash"
    fi
}

# Check write permissions
check_write_perms() {
    local dir="$1"
    if [[ ! -w "$dir" ]]; then
        warn "No write permission for $dir"
        return 1
    fi
    return 0
}

# Update shell profile
update_shell_profile() {
    local shell=$(detect_shell)

    # Check write permissions and try alternative dirs if needed
    if ! check_write_perms "$INSTALL_DIR"; then
        if [[ "$INSTALL_DIR" == "/usr/local/bin" ]]; then
            if [[ -w "/usr/local/bin" ]]; then
                # We have write perms, continue
                :
            elif [[ -w "$HOME/.local/bin" ]]; then
                warn "No write access to /usr/local/bin, using $HOME/.local/bin"
                INSTALL_DIR="$HOME/.local/bin"
            elif mkdir -p "$HOME/.local/bin" 2>/dev/null; then
                warn "No write access to /usr/local/bin, created $HOME/.local/bin"
                INSTALL_DIR="$HOME/.local/bin"
            else
                error "Cannot write to install directory. Please choose a writable location and set AC_CLI_INSTALL_DIR"
            fi
        elif ! mkdir -p "$INSTALL_DIR" 2>/dev/null; then
            error "Cannot create install directory $INSTALL_DIR. Please set AC_CLI_INSTALL_DIR to a writable location"
        fi
    fi

    # Create bin directory if needed
    mkdir -p "$INSTALL_DIR"

    # Copy binary
    info "Installing to $INSTALL_DIR/$BINARY_NAME"
    mv "$TMP_DIR/ac" "$INSTALL_DIR/$BINARY_NAME"

    local refresh_cmd=""

    case "$shell" in
        zsh)
            if ! grep -q "$INSTALL_DIR" "$HOME/.zshrc" 2>/dev/null; then
                {
                    echo ""
                    echo "# ac-cli"
                    echo "export PATH=\"$INSTALL_DIR:\$PATH\""
                } >> "$HOME/.zshrc"
                success "Added $INSTALL_DIR to PATH in ~/.zshrc"
                refresh_cmd="exec \$SHELL"
            else
                info "PATH already configured in ~/.zshrc"
            fi
            ;;
        bash)
            local profile="$HOME/.bashrc"
            if [[ ! -f "$profile" ]]; then
                profile="$HOME/.bash_profile"
                if [[ ! -f "$profile" ]]; then
                    # Create missing profile
                    touch "$profile"
                    info "Created missing $profile"
                fi
            fi
            if ! grep -q "$INSTALL_DIR" "$profile" 2>/dev/null; then
                {
                    echo ""
                    echo "# ac-cli"
                    echo "export PATH=\"$INSTALL_DIR:\$PATH\""
                } >> "$profile"
                success "Added $INSTALL_DIR to PATH in $profile"
                refresh_cmd="source $profile"
            else
                info "PATH already configured in $profile"
            fi
            ;;
        fish)
            if ! grep -q "$INSTALL_DIR" "$HOME/.config/fish/config.fish" 2>/dev/null; then
                mkdir -p "$HOME/.config/fish"
                {
                    echo ""
                    echo "# ac-cli"
                    echo "set -x PATH \"$INSTALL_DIR\" \$PATH"
                } >> "$HOME/.config/fish/config.fish"
                success "Added $INSTALL_DIR to PATH in ~/.config/fish/config.fish"
                refresh_cmd="source ~/.config/fish/config.fish"
            else
                info "PATH already configured in ~/.config/fish/config.fish"
            fi
            ;;
        *)
            warn "Unknown shell: $shell"
            warn "Please add $INSTALL_DIR to your PATH manually:"
            echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
            ;;
    esac

    if [[ -n "$refresh_cmd" ]]; then
        echo ""
        info "To activate PATH, run:"
        echo "  $refresh_cmd"
    fi
}

# Verify installation
verify_installation() {
    local binary_path="$INSTALL_DIR/$BINARY_NAME"

    if [[ ! -f "$binary_path" ]]; then
        error "Binary not found at $binary_path"
    fi

    info "Verifying installation..."
    if "$binary_path" --help >/dev/null 2>&1; then
        success "ac-cli installed successfully!"
        echo ""
        info "Binary location: $binary_path"
        info "Run 'ac --help' to get started"
    else
        error "Failed to verify installation. Please check $binary_path is executable."
    fi
}

# Check existing installation
check_existing() {
    local binary_path="$INSTALL_DIR/$BINARY_NAME"

    if [[ -f "$binary_path" ]]; then
        warn "Existing installation found at $binary_path"
        warn "This will overwrite the existing binary."
        read -p "Continue? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            info "Installation cancelled"
            exit 0
        fi
    fi
}

# Main installation
main() {
    echo ""
    info "Installing ac-cli..."
    echo ""

    # Check prerequisites
    check_prereqs

    # Check disk space (need at least 50MB free)
    if command_exists df; then
        local free_space=$(df . 2>/dev/null | awk 'NR==2 {print $4}')
        if [[ -n "$free_space" ]] && [[ $free_space -lt 50000 ]]; then
            warn "Low disk space detected. Ensure at least 50MB is available."
        fi
    fi

    # Check existing installation
    check_existing

    # Detect platform
    local platform=$(detect_platform)
    info "Detected platform: $platform"

    # Create temporary directory
    TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t ac-cli-install 2>/dev/null || {
        error "Failed to create temporary directory"
    })
    trap "rm -rf $TMP_DIR" EXIT
    [[ ! -d "$TMP_DIR" ]] && error "Temporary directory creation failed"

    # Download and verify binary
    download_binary "$platform"

    # Update shell profile
    update_shell_profile

    # Clean up temp dir
    rm -rf "$TMP_DIR"

    # Verify installation
    verify_installation
}

main "$@"
