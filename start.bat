@echo off
cd /d "%~dp0"
call npm run build
start http://localhost:3000
call npm start
