@echo off
title Sincronizar y Crear Espacio Seguro
echo ========================================================
echo SINCRONIZANDO CON MAIN Y CREANDO TU RAMA DE TRABAJO
echo ========================================================
echo.

:: 1. Ir a la carpeta donde se encuentra este script (.bat)
cd /d "%~dp0"

:: Ir a main y descargar actualizaciones
echo Volviendo a la rama principal (main)...
git checkout main
echo.
echo Descargando los cambios mas recientes de GitHub...
git pull origin main
echo.

echo ========================================================
echo REGLA DE ORO: Crea tu "fotocopia" (rama) para trabajar.
echo Usa guiones en el nombre (ej: interfaz-frontend, ruta-fincas)
echo ========================================================
echo.
set /p NOMBRE_RAMA="Introduce el nombre de tu nueva rama/tarea: "

:: Crear y cambiarse a la nueva rama
echo.
echo Creando y saltando a tu espacio seguro...
git checkout -b %NOMBRE_RAMA%

echo.
echo [OK] Ya estas en la rama: %NOMBRE_RAMA%
echo Activando entorno virtual de Python...
echo.

:: Deja la consola abierta y el entorno virtual activado para ejecutar FastAPI
call venv\Scripts\activate
cmd /k