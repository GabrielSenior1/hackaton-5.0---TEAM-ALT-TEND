@echo off
title Guardar y Subir Tarea a GitHub

echo ========================================================
echo   [GUARDANDO Y SUBIENDO TU TRABAJO A GITHUB]
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

echo [INFO] Rama actual: %CURRENT_BRANCH%
echo.

:: 3. Advertencia si esta en main (Evitamos parentesis anidados que causan errores)
if not "%CURRENT_BRANCH%"=="main" goto CHECK_STATUS

echo [ATENCION] Estas en la rama principal (main). 
echo Se recomienda altamente trabajar en una rama propia creada con el paso 2.
echo.
set /p CONFIRM_MAIN="Seguro que quieres subir cambios directamente a main? (s/n): "
if /i "%CONFIRM_MAIN%"=="s" goto CHECK_STATUS

echo.
echo Proceso cancelado. No se subio nada.
pause
exit /b 0

:CHECK_STATUS
:: 4. Mostrar archivos modificados
echo Cambios detectados en tu carpeta:
echo --------------------------------------------------------
git status -s
echo --------------------------------------------------------
echo.

:: 5. Preguntar al usuario si desea guardar
set /p CONFIRM_SAVE="Deseas guardar e incluir todos estos cambios? (s/n): "
if /i "%CONFIRM_SAVE%"=="s" goto DO_COMMIT

echo.
echo Proceso cancelado. No se subio nada.
pause
exit /b 0

:DO_COMMIT
echo.
set /p MSG="Describe en pocas palabras lo que hiciste (mensaje de commit): "

if "%MSG%"=="" (
    echo [ERROR] El mensaje no puede estar vacio.
    pause
    exit /b 1
)

:: 6. Agregar, hacer commit y push
echo.
echo Guardando cambios localmente...
git add .
git commit -m "%MSG%"

echo.
echo Descargando cambios remotos para evitar conflictos...
git pull --rebase origin %CURRENT_BRANCH%

if errorlevel 1 (
    echo [ERROR] No se pudieron descargar los cambios remotos.
    echo Posiblemente hay conflictos. Resolvelos manualmente y reintenta.
    pause
    exit /b 1
)

echo.
echo Subiendo cambios a GitHub (rama: %CURRENT_BRANCH%)...
git push origin %CURRENT_BRANCH%

if errorlevel 1 goto PUSH_ERROR

echo.
echo ========================================================
echo   [OK] CAMBIOS SUBIDOS A GITHUB CON EXITO!
echo ========================================================
echo Tus companeros ya pueden ver tus cambios en la rama:
echo %CURRENT_BRANCH%
echo ========================================================
pause
exit /b 0

:PUSH_ERROR
echo.
echo [ERROR] Hubo un problema al subir a GitHub.
echo Asegurate de tener conexion a internet y permisos de escritura en el repositorio.
pause
exit /b 1
