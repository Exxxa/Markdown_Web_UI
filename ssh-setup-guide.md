# SSH Setup and Key Management Guide

A comprehensive guide for setting up SSH and managing SSH keys on Debian systems.

## Installing SSH Server

### 1. Install OpenSSH Server
```bash
sudo apt update
sudo apt install openssh-server
```

### 2. Verify SSH Service
```bash
sudo systemctl status ssh
```

### 3. Enable SSH on Boot
```bash
sudo systemctl enable ssh
```

## Basic SSH Configuration

### 1. Edit SSH Configuration
```bash
sudo nano /etc/ssh/sshd_config
```

### 2. Recommended Security Settings
```bash
# Disable root login
PermitRootLogin no

# Use SSH Protocol 2
Protocol 2

# Disable empty passwords
PermitEmptyPasswords no

# Specify allowed users (optional)
AllowUsers username1 username2

# Change default port (optional, replace 22 with your port)
Port 22
```

### 3. Restart SSH Service
```bash
sudo systemctl restart ssh
```

## Setting Up SSH Keys

### 1. Generate SSH Key Pair (On Client Machine)
```bash
# Generate RSA key (4096 bits recommended)
ssh-keygen -t rsa -b 4096

# Or generate Ed25519 key (more modern)
ssh-keygen -t ed25519
```

When prompted:
- Enter file location (or press Enter for default)
- Enter passphrase (recommended for security)

### 2. Copy Public Key to Server

#### Method 1: Using ssh-copy-id (Recommended)
```bash
ssh-copy-id username@server_ip
```

#### Method 2: Manual Copy
```bash
# Create .ssh directory on server
ssh username@server_ip "mkdir -p ~/.ssh"

# Copy public key
cat ~/.ssh/id_rsa.pub | ssh username@server_ip "cat >> ~/.ssh/authorized_keys"

# Set correct permissions
ssh username@server_ip "chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys"
```

## Making SSH Remember Keys (SSH Agent Setup)

### 1. Start SSH Agent
```bash
# Start agent
eval $(ssh-agent)

# Add key to agent
ssh-add ~/.ssh/id_rsa  # Or ~/.ssh/id_ed25519 for Ed25519 keys
```

### 2. Make SSH Agent Persistent (Choose one method)

#### Method 1: Using systemd user service
1. Create service directory:
```bash
mkdir -p ~/.config/systemd/user
```

2. Create service file:
```bash
nano ~/.config/systemd/user/ssh-agent.service
```

3. Add content:
```ini
[Unit]
Description=SSH key agent

[Service]
Type=simple
Environment=SSH_AUTH_SOCK=%t/ssh-agent.socket
ExecStart=/usr/bin/ssh-agent -D -a $SSH_AUTH_SOCK

[Install]
WantedBy=default.target
```

4. Enable and start the service:
```bash
systemctl --user enable ssh-agent
systemctl --user start ssh-agent
```

5. Add to ~/.bashrc or ~/.zshrc:
```bash
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/ssh-agent.socket"
```

#### Method 2: Using ~/.bash_profile or ~/.bashrc
Add to file:
```bash
# Start SSH agent if not running
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval $(ssh-agent -s)
    ssh-add ~/.ssh/id_rsa  # Or ~/.ssh/id_ed25519
fi
```

## SSH Config File for Easy Connection

### 1. Create/Edit SSH Config
```bash
nano ~/.ssh/config
```

### 2. Add Host Configuration
```bash
# Set default for all hosts
Host *
    AddKeysToAgent yes
    ServerAliveInterval 60
    ServerAliveCountMax 2

# Example host configuration
Host myserver
    HostName 192.168.1.100
    User username
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

## Security Best Practices

### 1. SSH Key Protection
- Use strong passphrases for SSH keys
- Keep private keys secure
- Back up keys safely
- Use different keys for different purposes

### 2. Server Configuration
```bash
# Edit /etc/ssh/sshd_config
# Disable password authentication after setting up keys
PasswordAuthentication no

# Limit authentication attempts
MaxAuthTries 3

# Set login grace time
LoginGraceTime 1m

# Enable strict modes
StrictModes yes
```

### 3. File Permissions
```bash
# On client
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# On server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Troubleshooting

### 1. Check SSH Service
```bash
sudo systemctl status ssh
```

### 2. Check Logs
```bash
sudo tail -f /var/log/auth.log
```

### 3. Test SSH Connection
```bash
# Verbose connection test
ssh -v username@server_ip
```

### 4. Common Issues and Solutions

#### Permission Issues
```bash
# Fix permissions on client
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Fix permissions on server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

#### Key Not Working
```bash
# Verify key is added to agent
ssh-add -l

# Add key to agent
ssh-add ~/.ssh/id_rsa
```

#### Connection Issues
```bash
# Check SSH server status
sudo netstat -tulpn | grep ssh

# Check firewall
sudo ufw status
```

## Useful Commands Reference

```bash
# List added keys
ssh-add -l

# Remove all keys
ssh-add -D

# Remove specific key
ssh-add -d ~/.ssh/id_rsa

# Show fingerprint of public key
ssh-keygen -lf ~/.ssh/id_rsa.pub

# Convert key format
ssh-keygen -p -f ~/.ssh/id_rsa

# Test connection
ssh -T username@server_ip
```

## Backup and Recovery

### 1. Backup SSH Keys
```bash
# Copy entire .ssh directory
cp -r ~/.ssh ~/.ssh_backup

# Backup specific keys
cp ~/.ssh/id_rsa* ~/backup/
```

### 2. Restore Keys
```bash
# Restore with correct permissions
cp ~/backup/id_rsa* ~/.ssh/
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

Remember to:
1. Always backup your SSH keys
2. Keep private keys secure
3. Use strong passphrases
4. Regularly audit SSH access
5. Keep SSH configuration up to date
