/**
 * Simple static file server for development.
 * Serves index.html and supporting assets from the project root.
 *
 * Usage:
 *   npm install express
 *   node server.js
 */
const express = require('express');
const path = require('path');

const app = express();
const root = path.resolve(__dirname);

// Serve all files (HTML, CSS, JS) from project root
app.use(express.static(root));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/index.html`);
});