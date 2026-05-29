@echo off
:: Cacao de la Sierra - Script de Inicio Automatizado
:: TEAM ALT-TEND

echo ==================================================
echo   🌿 Iniciando Cacao de la Sierra API Backend 🌿
echo ==================================================

:: Detectar python
set PYTHON_CMD=python
python --version >nul 2>&1
if errorlevel 1 (
    set PYTHON_CMD=py
)


:check_env
:: 2. Verificar si existe el archivo .env, si no, crearlo desde .env.example
if not exist .env (
    echo [INFO] Creando archivo .env desde .env.example...
    copy .env.example .env
)

:: 3. Verificar si existe el entorno virtual (venv)
if exist venv goto run_app

echo [INFO] Creando entorno virtual (venv)...
%PYTHON_CMD% -m venv venv
if errorlevel 1 (
    echo [ERROR] No se pudo crear el entorno virtual.
    pause
    exit /b 1
)

echo [INFO] Entorno virtual creado exitosamente.
echo [INFO] Instalando dependencias (esto puede tardar unos momentos)...
venv\Scripts\python -m pip install --upgrade pip
venv\Scripts\pip install -r requirements.txt

:run_app
:: 4. Iniciar el backend y el frontend en la misma ventana
echo ==================================================
echo   🚀 Iniciando Servidores Cacao de la Sierra 🚀
echo ==================================================
echo.
echo [INFO] Iniciando backend de FastAPI...
start /b venv\Scripts\uvicorn main:app --reload

if exist "frontend" (
    echo [INFO] Iniciando frontend de Vite...
    start /b cmd /c "cd frontend && npm run dev"
) else (
    echo [WARN] No se encontro la carpeta 'frontend' para iniciar.
)

echo.
echo ==================================================
echo   ✅ ¡Servidores iniciados con exito!
echo ==================================================
echo.
echo Backend API corriendo en:   http://localhost:8000
echo Documentacion de la API:   http://localhost:8000/docs
echo.
if exist "frontend" (
    echo Frontend App corriendo en:  http://localhost:5173
    echo.
)
echo Presiona Ctrl+C en esta ventana para detener ambos servidores.
echo ==================================================
pause
