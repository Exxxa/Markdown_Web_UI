# Debian User Management Guide

This guide explains how to manage users, set privileges, and handle passwords on Debian-based systems.

## Adding Users

### Method 1: Using adduser (Recommended)
```bash
sudo adduser username
```
This interactive method will:
- Create home directory
- Set default shell
- Prompt for password
- Ask for user information (optional)

### Method 2: Using useradd (Manual)
```bash
sudo useradd -m -s /bin/bash username
sudo passwd username
```
Flags explained:
- `-m`: Create home directory
- `-s /bin/bash`: Set default shell to bash

## Managing User Privileges

### 1. Adding User to Groups

#### Add to sudo group (Administrative privileges)
```bash
sudo usermod -aG sudo username
```

#### Add to specific groups
```bash
sudo usermod -aG group1,group2 username
```

Common useful groups:
- `sudo`: Administrative privileges
- `adm`: System logs access
- `www-data`: Web server files
- `docker`: Docker access
- `ssh`: SSH access

#### View user's current groups
```bash
groups username
```

### 2. Using sudoers file

#### Edit sudoers file safely
```bash
sudo visudo
```

#### Common sudoers configurations:
```bash
# Give full sudo access
username ALL=(ALL:ALL) ALL

# Give passwordless sudo access
username ALL=(ALL:ALL) NOPASSWD:ALL

# Allow specific commands without password
username ALL=(ALL:ALL) NOPASSWD:/sbin/reboot, /sbin/shutdown
```

## Password Management

### 1. Change Your Own Password
```bash
passwd
```

### 2. Change Another User's Password (requires sudo)
```bash
sudo passwd username
```

### 3. Set Password Policies

#### Force password change on next login
```bash
sudo passwd -e username
```

#### Set password expiration
```bash
sudo chage -M 90 username  # Password expires in 90 days
```

#### View password status
```bash
sudo chage -l username
```

## User Account Management

### 1. Lock/Unlock User Account

#### Lock user account
```bash
sudo passwd -l username
```

#### Unlock user account
```bash
sudo passwd -u username
```

### 2. Delete User Account

#### Delete user only
```bash
sudo userdel username
```

#### Delete user and home directory
```bash
sudo userdel -r username
```

## System Verification Commands

### 1. View User Information
```bash
# View user details
id username

# List all users
cat /etc/passwd

# List all groups
cat /etc/group

# View logged-in users
who
w
```

### 2. Check User Privileges
```bash
# Check sudo privileges
sudo -l -U username

# View user's current groups
groups username
```

## Best Practices

1. **Strong Passwords**
   - Use minimum 12 characters
   - Mix uppercase, lowercase, numbers, and symbols
   - Avoid dictionary words and personal information

2. **Sudo Access**
   - Only grant sudo access when necessary
   - Use specific command permissions instead of full access
   - Regularly audit sudo users

3. **Security**
   - Regularly review user accounts
   - Remove unused accounts
   - Audit group memberships periodically
   - Set appropriate password policies

4. **Documentation**
   - Document all user accounts and their purposes
   - Keep track of group memberships
   - Document custom sudo permissions

## Common Issues and Solutions

### 1. User Can't Use Sudo
```bash
# Check if user is in sudo group
groups username

# Add to sudo group if missing
sudo usermod -aG sudo username

# User needs to log out and back in for changes to take effect
```

### 2. Password Issues
```bash
# Reset forgotten password
sudo passwd username

# Unlock locked account
sudo passwd -u username
```

### 3. Group Membership Issues
```bash
# View all groups
getent group

# Add to multiple groups
sudo usermod -aG group1,group2 username
```

## Important Files Reference

- `/etc/passwd`: User account information
- `/etc/shadow`: Encrypted password information
- `/etc/group`: Group information
- `/etc/sudoers`: Sudo privileges configuration
- `/home/`: User home directories

## Security Notes

1. Always use strong passwords
2. Regularly audit user accounts and privileges
3. Remove unnecessary access promptly
4. Document all user account changes
5. Use principle of least privilege
6. Regular security updates:
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

For any issues or questions, consult the system logs:
```bash
sudo tail -f /var/log/auth.log
```
