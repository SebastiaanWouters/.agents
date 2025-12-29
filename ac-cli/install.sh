#!/usr/bin/env bash
set -euo pipefail

# Configuration
GITHUB_REPO="sebastiaanwouters/.agents"
INSTALL_DIR="${AC_CLI_INSTALL_DIR:-$HOME/.ac-cli}"
BIN_LINK="${AC_CLI_BIN_LINK:-$HOME/.local/bin/ac}"
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
        x86_64|amd64) arch=x64 ;;
        arm64|aarch64) arch=arm64 ;;
        *) error "Unsupported architecture: $arch" ;;
    esac

    echo "${os}-${arch}"
}

# Check prerequisites
check_prereqs() {
    local missing=()

    command_exists curl || missing+=("curl")
    command_exists wget || missing+=("wget")
    command_exists chmod || missing+=("chmod")
    command_exists mkdir || missing+=("mkdir")
    command_exists shasum || missing+=("shasum")
    command_exists sha256sum || missing+=("sha256sum")

    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Missing required commands: ${missing[*]}"
    fi
}

# Install bun if missing
ensure_bun() {
    if command_exists bun; then
        info "bun is already installed: $(bun --version)"
        return
    fi

    warn "bun is not installed. Installing bun..."
    info "Running: curl -fsSL https://bun.sh/install | bash"
    bash -c "$(curl -fsSL https://bun.sh/install)"

    if ! command_exists bun; then
        error "Failed to install bun. Please install manually: curl -fsSL https://bun.sh/install | bash"
    fi

    success "bun installed successfully"
}

# Download file with curl or wget
download_file() {
    local url=$1
    local output=$2

    if command_exists curl; then
        local curl_path=$(command -v curl)
        # Check for broken snap curl
        if [[ $curl_path == *"/snap/"* ]]; then
            # Fallback to wget
            if command_exists wget; then
                wget -q --show-progress -O "$output" "$url"
            else
                error "curl installed via snap has permission issues. Please reinstall curl or install wget."
            fi
        else
            curl -fsSL --progress-bar -o "$output" "$url"
        fi
    elif command_exists wget; then
        wget -q --show-progress -O "$output" "$url"
    else
        error "Neither curl nor wget is available"
    fi
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
        actual_checksum=$(shasum -a 256 "$tmp_binary" | cut -d' ' -f1)
    else
        actual_checksum=$(sha256sum "$tmp_binary" | cut -d' ' -f1)
    fi

    info "Verifying checksum..."
    if [[ "$actual_checksum" != "$expected_checksum" ]]; then
        rm -f "$tmp_binary" "$tmp_checksum"
        error "Checksum verification failed!
Expected: $expected_checksum
Actual: $actual_checksum"
    fi

    success "Checksum verified"
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

# Update shell profile
update_shell_profile() {
    local shell=$(detect_shell)
    local bin_dir=$(dirname "$BIN_LINK")
    local shell_profiles=()
    local refresh_cmd=""

    case "$shell" in
        zsh)
            shell_profiles=("$HOME/.zshrc")
            refresh_cmd="exec \$SHELL"
            ;;
        bash)
            shell_profiles=("$HOME/.bashrc" "$HOME/.bash_profile")
            [[ ${#shell_profiles[@]} -eq 0 ]] && shell_profiles=("$HOME/.bashrc")
            refresh_cmd="source ~/.bashrc"
            ;;
        fish)
            shell_profiles=("$HOME/.config/fish/config.fish")
            refresh_cmd="source ~/.config/fish/config.fish"
            ;;
        *)
            warn "Unknown shell: $shell"
            warn "Please add $BIN_DIR to your PATH manually:"
            echo "  export PATH=\"$bin_dir:\$PATH\""
            return
            ;;
    esac

    # Create bin directory if needed
    mkdir -p "$bin_dir"

    # Copy binary
    info "Installing to $BIN_LINK"
    mv "$TMP_DIR/ac" "$BIN_LINK"

    local updated=0
    for profile in "${shell_profiles[@]}"; do
        if [[ -f $profile ]] && grep -q "$bin_dir" "$profile" 2>/dev/null; then
            info "PATH already configured in $profile"
            continue
        fi

        # Create profile directory if needed
        if [[ ! -f $profile ]]; then
            mkdir -p "$(dirname "$profile")"
            touch "$profile"
        fi

        # Add to PATH
        {
            echo ""
            echo "# ac-cli"
            echo "export PATH=\"$bin_dir:\$PATH\""
        } >> "$profile"

        success "Added $bin_dir to PATH in $profile"
        updated=1
    done

    if [[ $updated -eq 1 ]]; then
        echo ""
        info "To activate PATH, run:"
        echo "  $refresh_cmd"
    fi
}

# Verify installation
verify_installation() {
    if [[ ! -f "$BIN_LINK" ]]; then
        error "Binary not found at $BIN_LINK"
    fi

    info "Verifying installation..."
    if "$BIN_LINK" --help >/dev/null 2>&1; then
        success "ac-cli installed successfully!"

        # Initialize default skills
        info "Initializing default skills..."
        if ! "$BIN_LINK" init; then
            warn "Failed to initialize default skills. Run 'ac init' manually."
        fi
    else
        error "Failed to verify installation. Please check $BIN_LINK is executable."
    fi
}

# Main installation
main() {
    echo ""
    info "Installing ac-cli..."
    echo ""

    # Check prerequisites
    check_prereqs

    # Ensure bun is installed
    ensure_bun

    # Detect platform
    local platform=$(detect_platform)
    info "Detected platform: $platform"

    # Create temporary directory
    TMP_DIR=$(mktemp -d)
    trap "rm -rf $TMP_DIR" EXIT

    # Download and verify binary
    download_binary "$platform"

    # Update shell profile
    update_shell_profile

    # Clean up temp dir
    rm -rf "$TMP_DIR"

    echo ""
    success "ac-cli installed successfully!"
    info "Binary location: $BIN_LINK"
    info "Run 'ac --help' to get started"
    echo ""
    info "To update: curl -fsSL https://github.com/${GITHUB_REPO}/releases/latest/download/install.sh | bun run"
}

main "$@"
