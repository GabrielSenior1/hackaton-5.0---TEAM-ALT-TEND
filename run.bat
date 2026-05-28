@echo off
:: Cacao de la Sierra - Script de Inicio Automatizado
:: TEAM ALT-TEND

echo ==================================================
echo   🌿 Iniciando Cacao de la Sierra API Backend 🌿
echo ==================================================

:: 1. Detectar comando de Python a usar (Priorizando versiones estables y compatibles como 3.12 y 3.11)
set PYTHON_CMD=
echo [INFO] Detectando version de Python compatible...

py -3.12 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.12
    echo [INFO] Se detecto Python 3.12. Usando 'py -3.12'.
    goto check_env
)

py -3.11 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.11
    echo [INFO] Se detecto Python 3.11. Usando 'py -3.11'.
    goto check_env
)

py -3.13 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.13
    echo [INFO] Se detecto Python 3.13. Usando 'py -3.13'.
    goto check_env
)

py --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    echo [INFO] Se detecto el lanzador 'py' (usara version por defecto).
    goto check_env
)

python --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python
    echo [INFO] Usando comando 'python' del sistema.
    goto check_env
)

echo [ERROR] No se encontro Python en el sistema.
echo Por favor instala Python o asegurate de que este en las variables de entorno (PATH).
pause
exit /b 1

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
:: 4. Iniciar el backend y el frontend en ventanas separadas
echo ==================================================
echo   🚀 Iniciando Servidores Cacao de la Sierra 🚀
echo ==================================================
echo.
echo [INFO] Iniciando backend de FastAPI en segundo plano...
start "Cacao - Backend API" cmd /c "title Cacao Backend && venv\Scripts\uvicorn main:app --reload"

if exist "frontend" (
    echo [INFO] Iniciando frontend de Vite en segundo plano...
    start "Cacao - Frontend App" cmd /c "title Cacao Frontend && cd frontend && npm run dev"
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
echo Las ventanas del Backend y Frontend se han abierto por separado.
echo Puedes dejarlas abiertas para trabajar y cerrarlas al terminar.
echo ==================================================
echo Presiona cualquier tecla para finalizar este script de inicio...
pause >nul
exit /b 0
