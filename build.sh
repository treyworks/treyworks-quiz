#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy source files to dist
echo "Copying source files to dist directory..."
cp src/quiz.js dist/quiz.js
cp src/quiz.css dist/quiz.css

# Create minified versions (placeholder - in a real project you'd use proper minification tools)
echo "Creating minified versions (placeholder)..."
cp dist/quiz.js dist/quiz.min.js
cp dist/quiz.css dist/quiz.min.css

echo "Build completed successfully!"
echo "Files created:"
ls -la dist/

echo ""
echo "Note: For production use, install the required dependencies and use the npm scripts:"
echo "  npm install"
echo "  npm run build"
echo "  npm run minify"
