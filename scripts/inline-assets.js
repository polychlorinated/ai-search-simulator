#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths (adjust if necessary)
const templatePath = path.join(__dirname, '../index.template.html');
const outputPath = path.join(__dirname, '../index.html');
const stylesPath = path.join(__dirname, '../styles.css');

// Read files
const template = fs.readFileSync(templatePath, 'utf8');
const styles = fs.readFileSync(stylesPath, 'utf8');

// Inject content
const output = template.replace('<!-- INLINE_STYLES -->', styles);

// Write final index.html
fs.writeFileSync(outputPath, output, 'utf8');
console.log('Built index.html from template.');