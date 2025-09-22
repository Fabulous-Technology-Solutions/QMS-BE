#!/bin/bash
# Quick Chrome Installation for AWS EC2
# Run this script to install Chrome and fix Puppeteer issues

echo "🚀 Installing Google Chrome on AWS EC2..."

# Detect OS and install Chrome
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    
    if [[ "$OS" == *"Amazon Linux"* ]] || [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        echo "📦 Installing Chrome on $OS"
        
        # Install Chrome for Red Hat-based systems
        sudo yum update -y
        
        # Download and install Chrome
        cd /tmp
        wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
        sudo yum localinstall -y google-chrome-stable_current_x86_64.rpm
        
        # Install additional dependencies
        sudo yum install -y atk cups-libs gtk3 libXcomposite libXcursor libXdamage \
            libXext libXi libXrandr libXScrnSaver libXtst pango at-spi2-atk libXt \
            xorg-x11-server-Xvfb xorg-x11-xauth dbus-glib dbus-glib-devel nss \
            mesa-libgbm
        
    elif [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        echo "📦 Installing Chrome on $OS"
        
        # Install Chrome for Debian-based systems
        sudo apt-get update
        
        # Add Google Chrome repository
        wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
        echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
        
        sudo apt-get update
        sudo apt-get install -y google-chrome-stable
        
        # Install additional dependencies
        sudo apt-get install -y fonts-liberation libasound2 libatk-bridge2.0-0 \
            libatk1.0-0 libatspi2.0-0 libcups2 libdrm2 libgtk-3-0 libnspr4 \
            libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
            xdg-utils libu2f-udev libvulkan1 libgbm1
        
    else
        echo "❌ Unsupported OS: $OS"
        exit 1
    fi
else
    echo "❌ Cannot detect OS"
    exit 1
fi

# Verify installation
echo "🔍 Verifying Chrome installation..."
if command -v google-chrome-stable &> /dev/null; then
    echo "✅ Chrome installed successfully!"
    google-chrome-stable --version
    
    # Create symbolic links for compatibility
    sudo ln -sf /usr/bin/google-chrome-stable /usr/bin/google-chrome 2>/dev/null || true
    sudo ln -sf /usr/bin/google-chrome-stable /usr/bin/chromium-browser 2>/dev/null || true
    sudo ln -sf /usr/bin/google-chrome-stable /usr/bin/chromium 2>/dev/null || true
    
    echo "✅ Symbolic links created for compatibility"
else
    echo "❌ Chrome installation failed"
    exit 1
fi

# Clean up corrupted Puppeteer downloads
echo "🧹 Cleaning up corrupted Puppeteer downloads..."
sudo rm -f /tmp/chromium 2>/dev/null || true
sudo rm -rf /tmp/chrome-* 2>/dev/null || true

# Set environment variables
echo "🔧 Setting up environment variables..."
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
export CHROME_BIN=/usr/bin/google-chrome-stable

# Add to profile for persistence
echo 'export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true' >> ~/.bashrc
echo 'export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
echo 'export CHROME_BIN=/usr/bin/google-chrome-stable' >> ~/.bashrc

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Restart your application:"
echo "   pm2 restart all"
echo ""
echo "2. Or run with environment variables:"
echo "   PUPPETEER_DEBUG=true PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable npm start"
echo ""
echo "3. Test Chrome installation:"
echo "   google-chrome-stable --headless --no-sandbox --dump-dom https://www.google.com"