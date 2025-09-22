#!/bin/bash
# AWS EC2 Puppeteer Setup Script
# Run this script on your EC2 instance to install Chrome and dependencies

echo "🚀 Setting up Puppeteer dependencies on AWS EC2..."

# Detect the OS
if [ -f /etc/redhat-release ]; then
    # Amazon Linux / CentOS / RHEL
    echo "📦 Detected Red Hat-based system (Amazon Linux/CentOS/RHEL)"
    
    # Update system
    sudo yum update -y
    
    # Install Chrome
    sudo yum install -y wget
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo rpm --import -
    sudo sh -c 'echo "[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl.google.com/linux/linux_signing_key.pub" > /etc/yum.repos.d/google-chrome.repo'
    
    sudo yum install -y google-chrome-stable
    
    # Install additional dependencies
    sudo yum install -y \
        atk \
        cups-libs \
        gtk3 \
        libXcomposite \
        libXcursor \
        libXdamage \
        libXext \
        libXi \
        libXrandr \
        libXScrnSaver \
        libXtst \
        pango \
        at-spi2-atk \
        libXt \
        xorg-x11-server-Xvfb \
        xorg-x11-xauth \
        dbus-glib \
        dbus-glib-devel \
        nss \
        mesa-libgbm

elif [ -f /etc/debian_version ]; then
    # Ubuntu / Debian
    echo "📦 Detected Debian-based system (Ubuntu/Debian)"
    
    # Update system
    sudo apt-get update
    
    # Install Chrome
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt-get update
    sudo apt-get install -y google-chrome-stable
    
    # Install additional dependencies
    sudo apt-get install -y \
        fonts-liberation \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libatspi2.0-0 \
        libcups2 \
        libdrm2 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxrandr2 \
        xdg-utils \
        libu2f-udev \
        libvulkan1 \
        libgbm1

else
    echo "❌ Unsupported operating system"
    exit 1
fi

# Verify Chrome installation
if command -v google-chrome &> /dev/null; then
    echo "✅ Chrome installed successfully"
    google-chrome --version
else
    echo "❌ Chrome installation failed"
    exit 1
fi

# Create symbolic links for compatibility
sudo ln -sf /usr/bin/google-chrome-stable /usr/bin/google-chrome 2>/dev/null || true
sudo ln -sf /usr/bin/google-chrome-stable /usr/bin/chromium-browser 2>/dev/null || true
sudo ln -sf /usr/bin/google-chrome-stable /usr/bin/chromium 2>/dev/null || true

echo "🎉 Puppeteer setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Rebuild your Docker image: docker build -t your-app ."
echo "2. Set environment variables:"
echo "   export PUPPETEER_DEBUG=true"
echo "   export AWS_REGION=your-region"
echo "3. Test your application"
echo ""
echo "🔧 If you're still having issues, run your app with:"
echo "   PUPPETEER_DEBUG=true node dist/index.js"