@echo off
set "HTTPS=true"
set "SSL_CRT_FILE=../airdnd-server/certificates/cert.pem"
set "SSL_KEY_FILE=../airdnd-server/certificates/key.pem"
npm start
