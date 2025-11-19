#!/bin/bash

###############################################################################
# Setup Guide Script
# 
# This script helps you set up the test automation framework.
# It verifies prerequisites and installs dependencies.
###############################################################################

echo "=========================================="
echo "Test Automation Framework Setup"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success message
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error message
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print info message
print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

echo "Step 1: Checking Prerequisites..."
echo "-----------------------------------"

# Check Node.js
if command -v node &> /dev/null
then
    NODE_VERSION=$(node -v)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if version is >= 18
    NODE_MAJOR_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current: $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js is not installed"
    print_info "Please install Node.js from: https://nodejs.org"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm -v)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

echo ""
echo "Step 2: Installing Dependencies..."
echo "-----------------------------------"

# Install npm packages
print_info "Running: npm install"
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 3: Installing Playwright Browsers..."
echo "-------------------------------------------"

# Install Playwright browsers
print_info "Running: npx playwright install"
npx playwright install

if [ $? -eq 0 ]; then
    print_success "Playwright browsers installed successfully"
else
    print_error "Failed to install Playwright browsers"
    exit 1
fi

echo ""
echo "Step 4: Verifying Installation..."
echo "-----------------------------------"

# Check Playwright version
if npx playwright --version &> /dev/null
then
    PLAYWRIGHT_VERSION=$(npx playwright --version)
    print_success "Playwright is ready: $PLAYWRIGHT_VERSION"
else
    print_error "Playwright verification failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Run tests: npm test"
echo "2. View report: npm run report"
echo "3. Read docs: README.md"
echo ""
echo "Available Commands:"
echo "  npm test           - Run all tests"
echo "  npm run test:ui    - Run UI tests only"
echo "  npm run test:api   - Run API tests only"
echo "  npm run test:headed - Run with visible browser"
echo "  npm run report     - View test report"
echo ""
echo "Happy Testing! 🚀"

