# Debian Status Monitor for Home Assistant

This guide explains how to set up a Python-based status monitor that reports your Debian system's status to Home Assistant via MQTT.

## Prerequisites

- Debian-based system (Debian 12 or newer)
- Home Assistant with MQTT broker configured
- Python 3.x installed
- Sudo privileges

## Installation Steps

### 1. Install Required Packages

```bash
sudo apt update
sudo apt install -y python3-pip mosquitto-clients
pip3 install paho-mqtt psutil
```

### 2. Set Up MQTT Authentication

1. Generate the password hash:
```bash
mosquitto_passwd -c mosquitto_passwd_file yourusername
```

2. Copy the generated hash and update your Home Assistant's configuration.yaml:
```yaml
mqtt:
  username: yourusername
  password: YOUR_GENERATED_HASH
```

3. Restart Home Assistant to apply changes.

### 3. Create the Status Monitor Script

1. Create the script directory:
```bash
sudo mkdir -p /usr/local/bin
```

2. Create the Python script:
```bash
sudo nano /usr/local/bin/ha_debian_status.py
```

3. Copy the Python script content from the provided file into ha_debian_status.py

4. Make the script executable:
```bash
sudo chmod +x /usr/local/bin/ha_debian_status.py
```

### 4. Configure the Script

Edit the script and update these variables:
```python
MQTT_BROKER = "YOUR_MQTT_BROKER_IP"    # Example: "192.168.1.100"
MQTT_USERNAME = "yourusername"         # Your MQTT username
MQTT_PASSWORD = "YOUR_PASSWORD"        # Your MQTT password
```

### 5. Create Systemd Service

1. Create the service file:
```bash
sudo nano /etc/systemd/system/ha-debian-status.service
```

2. Add this content (replace YOUR_USERNAME with your actual username):
```ini
[Unit]
Description=Home Assistant Debian Status Monitor
After=network.target

[Service]
ExecStart=/usr/bin/python3 /usr/local/bin/ha_debian_status.py
Restart=always
User=YOUR_USERNAME
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```

### 6. Enable and Start the Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable ha-debian-status
sudo systemctl start ha-debian-status
```

## Verification and Troubleshooting

### Check Service Status
```bash
sudo systemctl status ha-debian-status
```

### View Logs
```bash
sudo journalctl -u ha-debian-status -f
```

### Common Issues and Solutions

1. Connection Refused:
   - Verify MQTT broker IP address
   - Check if MQTT broker is running
   - Verify firewall settings

2. Authentication Failed:
   - Double-check username and password
   - Verify MQTT broker settings in Home Assistant
   - Ensure password hash is correctly copied

3. Service Won't Start:
   - Check logs for detailed error messages
   - Verify Python script permissions
   - Ensure all dependencies are installed

## Home Assistant Integration

After successful setup:
1. The device will automatically appear in Home Assistant via MQTT discovery
2. Look for a new binary sensor with your Debian hostname
3. The sensor will show online/offline status
4. Device information will be available in Home Assistant

## Maintenance

### Updating the Script
1. Edit the Python script:
```bash
sudo nano /usr/local/bin/ha_debian_status.py
```

2. Restart the service after changes:
```bash
sudo systemctl restart ha-debian-status
```

### Uninstalling
```bash
sudo systemctl stop ha-debian-status
sudo systemctl disable ha-debian-status
sudo rm /etc/systemd/system/ha-debian-status.service
sudo rm /usr/local/bin/ha_debian_status.py
sudo systemctl daemon-reload
```

## Additional Notes

- The status is updated every 60 seconds (configurable in the script)
- The script uses MQTT retained messages
- Automatic reconnection is implemented for connection losses
- Last Will and Testament (LWT) is configured for proper offline detection

For any issues or questions, check the systemd logs or Home Assistant MQTT logs for debugging information.
