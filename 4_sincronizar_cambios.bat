@echo off
title Sincronizar Cambios de GitHub

echo ========================================================
echo   [SINCRONIZANDO TU RAMA CON LOS CAMBIOS DE GITHUB]
echo ========================================================
echo.

:: 1. Ir a la carpeta donde se encuentra este script (.bat)
cd /d "%~dp0"

:: 2. Detectar la rama actual
set CURRENT_BRANCH=
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

if "%CURRENT_BRANCH%"=="" (
    echo [ERROR] No se pudo detectar la rama de Git actual.
    pause
    exit /b 1
)

echo [INFO] Rama activa actual: %CURRENT_BRANCH%
echo.

:: 3. Si esta en main, solo descarga cambios de GitHub
if "%CURRENT_BRANCH%"=="main" goto SYNC_MAIN

:: 4. Advertencia de cambios locales sin guardar
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo [ATENCION] Tienes cambios locales sin guardar en tu rama %CURRENT_BRANCH%.
    echo Se recomienda hacer commit de tus cambios primero usando el paso 3
    echo para evitar conflictos de fusion.
    echo.
    set /p CONFIRM_SYNC="Deseas continuar con la sincronizacion de todas formas? (s/n): "
    if /i not "%CONFIRM_SYNC%"=="s" (
        echo.
        echo Sincronizacion cancelada.
        pause
        exit /b 0
    )
)

:: 5. Proceso de Sincronizacion para ramas de trabajo
echo.
echo Paso 1: Cambiando a rama principal (main) para descargar actualizaciones...
git checkout main

echo.
echo Paso 2: Descargando ultimos cambios de tus companeros desde GitHub...
git pull origin main

echo.
echo Paso 3: Regresando a tu rama de trabajo (%CURRENT_BRANCH%)...
git checkout %CURRENT_BRANCH%

echo.
echo Paso 4: Fusionando los cambios nuevos de GitHub en tu rama...
git merge main --no-edit

if errorlevel 1 goto MERGE_ERROR

goto FINISH

:SYNC_MAIN
echo [INFO] Ya estas en la rama principal (main).
echo Descargando cambios mas recientes de tus companeros desde GitHub...
echo.
git pull origin main
goto FINISH

:MERGE_ERROR
echo.
echo [ADVERTENCIA] Hubo conflictos al fusionar. 
echo Esto pasa cuando tu y un companero modifican la misma linea del mismo archivo.
echo Abre los archivos con marcas de conflicto (<<<<<<<) para resolverlos.
pause
exit /b 1

:FINISH
echo.
echo ========================================================
echo   [OK] SINCRONIZACION COMPLETADA CON EXITO!
echo ========================================================
echo Tu rama de trabajo '%CURRENT_BRANCH%' esta 100%% al dia
echo con los ultimos cambios de GitHub de tus companeros.
echo ========================================================
pause
exit /b 0
