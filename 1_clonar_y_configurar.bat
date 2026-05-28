@echo off
title Configurar Proyecto Hackaton 5.0
echo ========================================================
echo CONFIGURANDO ENTORNO: CACAO DE LA SIERRA
echo ========================================================
echo.

:: 1. Ir a la carpeta donde se encuentra este script (.bat)
cd /d "%~dp0"

:: 2. Verificar si ya estamos dentro del repositorio o si debemos clonar
if exist ".git" (
    echo [INFO] Ya estas dentro de la carpeta del repositorio. Saltando clonacion.
    goto detect_python
)

echo Descargando codigo desde GitHub...
if not exist "hackaton-5.0---TEAM-ALT-TEND" (
    git clone https://github.com/GabrielSenior1/hackaton-5.0---TEAM-ALT-TEND.git
    cd hackaton-5.0---TEAM-ALT-TEND
) else (
    echo [INFO] La carpeta del proyecto ya existe.
    cd hackaton-5.0---TEAM-ALT-TEND
)

:detect_python
:: 3. Detectar versión de Python compatible (Priorizando 3.12 / 3.11 / 3.13)
set PYTHON_CMD=
py -3.12 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.12
    goto create_venv
)
py -3.11 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.11
    goto create_venv
)
py -3.13 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.13
    goto create_venv
)
py --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    goto create_venv
)
python --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python
    goto create_venv
)

echo [ERROR] No se encontro Python en el sistema.
echo Por favor instala Python o asegurate de que este en las variables de entorno (PATH).
pause
exit /b 1

:create_venv
echo [INFO] Usando Python: %PYTHON_CMD%
echo.
echo Creando entorno virtual (venv)...
if not exist venv (
    %PYTHON_CMD% -m venv venv
) else (
    echo [INFO] El entorno virtual ya existe.
)

:: 4. Activar entorno e instalar dependencias de Python
echo.
echo Activando entorno virtual e instalando dependencias (esto puede tardar)...
venv\Scripts\python -m pip install --upgrade pip
venv\Scripts\pip install -r requirements.txt

:: 5. Crear archivo de configuracion base (.env)
echo.
echo Copiando archivo de variables de entorno (.env)...
if not exist .env (
    copy .env.example .env
) else (
    echo [INFO] El archivo .env ya existe.
)

echo.
echo ========================================================
echo ¡PROCESO COMPLETADO! 
echo El proyecto esta configurado en la carpeta actual:
echo %CD%
echo ========================================================
pause