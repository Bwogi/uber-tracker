# Network Access Guide

## Your Current Local IP Address
Your Mac's current IP address: **10.120.154.185**

## Quick Start

### Development Mode
```bash
npm run dev
```

The app will be accessible at:
- **Local**: http://localhost:3000
- **Network**: http://10.120.154.185:3000

### Production Mode
```bash
npm run build
npm start
```

The app will be accessible at:
- **Local**: http://localhost:3000
- **Network**: http://10.120.154.185:3000

## Access from Other Devices

### On the Same WiFi Network:
1. Make sure your Mac and the device are on the same WiFi network
2. On your phone/tablet/other computer, open a browser
3. Navigate to: **http://10.120.154.185:3000**

### Important Notes:
- Your IP address may change if you reconnect to WiFi or restart your Mac
- The Mac must be awake and the server running for access to work
- Firewall settings may block connections (see troubleshooting below)

## Finding Your Current IP Address

If your IP changes, find it again with:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Or check System Settings > Network > [Your Connection] > Details > TCP/IP

## Troubleshooting

### Cannot Connect from Other Devices?

**1. Check Firewall Settings:**
```bash
# Open System Settings
open "x-apple.systempreferences:com.apple.preference.security?Firewall"
```

Then:
- Go to System Settings > Network > Firewall
- If Firewall is ON, click "Options"
- Make sure Node is allowed to accept incoming connections
- Or temporarily disable firewall for testing

**2. Verify Server is Running:**
```bash
# Check if port 3000 is listening
lsof -i :3000
```

**3. Test Local Access First:**
```bash
curl http://localhost:3000/api/stats
```

**4. Test Network Access from Mac:**
```bash
curl http://10.120.154.185:3000/api/stats
```

### IP Address Keeps Changing?

#### Option A: Set Static IP (Recommended)
1. Open System Settings
2. Go to Network > [Your WiFi/Ethernet]
3. Click "Details"
4. Go to TCP/IP tab
5. Change "Configure IPv4" from "Using DHCP" to "Manually"
6. Set:
   - IP Address: 10.120.154.185
   - Subnet Mask: 255.255.255.0
   - Router: (your router IP, usually 10.120.154.1)
7. Click OK and Apply

#### Option B: Use mDNS (Bonjour)
Access via your Mac's hostname instead of IP:
```
http://your-mac-name.local:3000
```

Find your hostname:
```bash
hostname
```

## Using on Phone/Tablet

1. Connect to the same WiFi network
2. Open browser (Safari, Chrome, etc.)
3. Go to: **http://10.120.154.185:3000**
4. Bookmark it for easy access!

### Add to Home Screen (iOS/Android):
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap Share button
3. Select "Add to Home Screen"
4. Now it acts like a native app!

## Security Considerations

Since the app is accessible on your local network:
- Only devices on the same WiFi can access it
- It's NOT accessible from the internet
- Consider your home network security
- Database is stored locally on your Mac

## Alternative Commands

### Run Only Locally (no network access):
```bash
npm run dev:local
npm run start:local
```

### Specify Custom Port:
```bash
npm run dev -- -p 3001 -H 0.0.0.0
```

### Run in Production Mode:
```bash
npm run build
npm start
```
Production mode is faster and more stable for regular use.

## Keeping Server Running

### Option 1: Keep Terminal Open
Just leave the terminal window open with the server running.

### Option 2: Use PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start "npm start" --name uber-tracker

# Server will keep running even if you close terminal
# Auto-restart on crashes

# Useful PM2 commands:
pm2 status          # Check status
pm2 logs uber-tracker  # View logs
pm2 stop uber-tracker  # Stop server
pm2 restart uber-tracker  # Restart server
pm2 delete uber-tracker  # Remove from PM2
```

### Option 3: Create a Launch Agent (macOS)
Make the app start automatically when you log in:

1. Create a plist file at:
   `~/Library/LaunchAgents/com.uber-tracker.plist`

2. Content:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.uber-tracker</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/andrewbwogi/UBER/uber-tracker/node_modules/.bin/next</string>
        <string>start</string>
        <string>-H</string>
        <string>0.0.0.0</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/andrewbwogi/UBER/uber-tracker</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

3. Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.uber-tracker.plist
```

## Summary

Your Uber Tracker is now accessible on your local network!

**Quick Access URLs:**
- From your Mac: http://localhost:3000
- From other devices: http://10.120.154.185:3000

Keep your Mac running and the server will be accessible to all your devices on the same WiFi! 🚗💰
