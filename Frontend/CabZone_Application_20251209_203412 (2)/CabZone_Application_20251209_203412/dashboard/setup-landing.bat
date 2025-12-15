@echo off
echo ========================================
echo CABZONE Landing Page Migration Setup
echo ========================================
echo.

echo Step 1: Creating directories...
if not exist "src\styles" mkdir "src\styles"
if not exist "src\pages" mkdir "src\pages"
if not exist "src\components\landing" mkdir "src\components\landing"
if not exist "public\images" mkdir "public\images"
echo ✓ Directories created
echo.

echo Step 2: Copying CSS file...
copy "..\styles.css" "src\styles\landing.css"
echo ✓ CSS copied
echo.

echo Step 3: Copying images...
xcopy /E /I /Y "..\images" "public\images"
echo ✓ Images copied
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
echo The landing page components are already created!
echo Check REACT_MIGRATION_GUIDE.md for details.
echo.
pause
