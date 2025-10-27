@echo off
echo ====================================
echo  VERIFICANDO ERROS DE TYPESCRIPT
echo ====================================
echo.

cd /d "%~dp0"

echo Executando verificacao de tipos...
call npm run type-check

echo.
echo ====================================
echo  VERIFICACAO CONCLUIDA
echo ====================================
pause
