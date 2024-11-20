# Wake-on-LAN Setup Guide for Debian

## Prerequisites

First, install the necessary tools:
```bash
sudo apt update
sudo apt install ethtool net-tools
```

## Setup Process

### 1. Identify Network Interface

```bash
# List all network interfaces
ip a
# or
ifconfig
```
Note your network interface name (e.g., eth0, enp3s0)

### 2. Check Current WoL Status

```bash
# Check if WoL is currently enabled
sudo ethtool INTERFACE_NAME | grep Wake-on
```
Replace INTERFACE_NAME with your actual interface name (e.g., eth0)

### 3. Enable WoL on Current Session

```bash
# Enable WoL
sudo ethtool -s INTERFACE_NAME wol g
```

### 4. Make WoL Persistent Across Reboots

#### Method 1: Using systemd service

1. Create a new service file:
```bash
sudo nano /etc/systemd/system/wol.service
```

2. Add the following content:
```ini
[Unit]
Description=Enable Wake On Lan
After=network.target

[Service]
Type=oneshot
ExecStart=/sbin/ethtool -s INTERFACE_NAME wol g
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```
Replace INTERFACE_NAME with your actual interface name

3. Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable wol
sudo systemctl start wol
```

#### Method 2: Using NetworkManager

1. Create a new NetworkManager script:
```bash
sudo nano /etc/NetworkManager/dispatcher.d/99-wake-on-lan
```

2. Add the following content:
```bash
#!/bin/sh
if [ "$2" = "up" ]; then
    /sbin/ethtool -s INTERFACE_NAME wol g
fi
```
Replace INTERFACE_NAME with your actual interface name

3. Make the script executable:
```bash
sudo chmod +x /etc/NetworkManager/dispatcher.d/99-wake-on-lan
```

### 5. BIOS/UEFI Settings

1. Restart your computer and enter BIOS/UEFI settings
2. Look for options like:
   - Power Management
   - Wake-on-LAN
   - Network Stack
   - PCI Device Power On
   - PCIe Power Wake
3. Enable these options
4. Save and exit

### 6. Find MAC Address

```bash
# Get your MAC address
ip link show INTERFACE_NAME | grep "link/ether"
# or
ifconfig INTERFACE_NAME | grep "ether"
```
Save this MAC address for sending WoL magic packets

## Testing WoL

### 1. Install WoL Tools on Another Computer

On another Linux machine:
```bash
sudo apt install wakeonlan
```

On Windows:
- Download a WoL tool like "Wake on LAN Sender"

### 2. Send WoL Magic Packet

From Linux:
```bash
wakeonlan MAC_ADDRESS
# or specify broadcast address
wakeonlan -i BROADCAST_ADDRESS MAC_ADDRESS
```

Example:
```bash
wakeonlan 00:11:22:33:44:55
# or
wakeonlan -i 192.168.1.255 00:11:22:33:44:55
```

## Troubleshooting

### 1. Check WoL Status
```bash
# Verify WoL is enabled
sudo ethtool INTERFACE_NAME | grep Wake-on
# Should show Wake-on: g
```

### 2. Common Issues

#### WoL not working after reboot
- Verify the systemd service is running:
```bash
sudo systemctl status wol
```
- Check NetworkManager script:
```bash
ls -l /etc/NetworkManager/dispatcher.d/99-wake-on-lan
```

#### Network interface not supporting WoL
```bash
# Check supported features
sudo ethtool INTERFACE_NAME
```
Look for "Supports Wake-on" in the output

#### BIOS/UEFI settings reset
- Re-enter BIOS/UEFI and verify WoL settings
- Update BIOS/UEFI if needed

### 3. Testing Network Connection

```bash
# Test if port is open (default WoL port is 9)
sudo netstat -ludn | grep 9

# Check if magic packets are being received (requires tcpdump)
sudo tcpdump -i INTERFACE_NAME ether proto 0x0842 or udp port 9
```

## Tips for Reliable WoL

1. Use a static IP address for the computer
2. Configure your router to:
   - Forward WoL packets (UDP port 7 or 9)
   - Allow broadcast packets
   - Enable ARP proxy if needed

3. Add port forwarding if accessing from internet:
   - Forward UDP port 9 to your computer's IP
   - Use strong security measures

## Power Management Settings

### 1. Disable Fast Startup on Linux
```bash
# Check if enabled
cat /sys/power/mem_sleep

# Modify grub if needed
sudo nano /etc/default/grub
# Add "mem_sleep_default=deep" to GRUB_CMDLINE_LINUX_DEFAULT
```

### 2. Check Power Management
```bash
# View current power settings
sudo powertop

# View current power management settings
cat /sys/power/state
```

## Security Considerations

1. WoL can be a security risk if exposed to the internet
2. Use a VPN or secure gateway for remote wake-up
3. Consider implementing MAC address filtering
4. Monitor wake-up events in system logs:
```bash
sudo journalctl | grep "Wake-up"
```

Remember to:
1. Save your MAC address
2. Test WoL before relying on it
3. Document your network configuration
4. Regularly verify WoL is still working
5. Keep BIOS/UEFI updated
