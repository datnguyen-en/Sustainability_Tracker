@echo off
echo Starting Air Quality Prediction Dashboard...

echo.
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting Python model server...
start "Model Server" python model_server.py

echo.
echo Waiting for model server to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Next.js development server...
npm run dev

echo.
echo Both servers are now running!
echo - Model server: http://localhost:5000
echo - Next.js app: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers 