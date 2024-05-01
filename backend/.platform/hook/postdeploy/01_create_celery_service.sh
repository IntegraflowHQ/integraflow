#!/usr/bin/env bash

# Create the celery systemd service file
echo "[Unit]
Name=Celery
Description=Celery service for __
After=network.target
StartLimitInterval=0
[Service]
Type=simple
Restart=always
RestartSec=30
User=root
WorkingDirectory=/var/app/current
ExecStart=$PYTHONPATH/celery -A config worker --loglevel=INFO
ExecReload=$PYTHONPATH/celery -A config worker --loglevel=INFO
EnvironmentFile=/opt/elasticbeanstalk/deployment/env
[Install]
WantedBy=multi-user.target
" | tee /etc/systemd/system/celery.service

# Start celery service
systemctl start celery.service

# Enable celery service to load on system start
systemctl enable celery.service
