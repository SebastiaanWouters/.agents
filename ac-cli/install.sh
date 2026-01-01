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

# Check prerequisites
check_prereqs() {
    local missing=()

    command_exists curl || command_exists wget || error "Either curl or wget is required"
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

    if command_exists curl; then
        local curl_path=$(command -v curl)
        # Check for broken snap curl
        if [[ $curl_path == *"/snap/"* ]]; then
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

# Update shell profile
update_shell_profile() {
    local shell=$(detect_shell)

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
                    echo "export PATH=\"$INSTALL_DIR:\$PATH\""
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

# Main installation
main() {
    echo ""
    info "Installing ac-cli..."
    echo ""

    # Check prerequisites
    check_prereqs

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

    # Verify installation
    verify_installation
}

main "$@"
