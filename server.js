const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist/todo-frontend')));

// Redirect all non-static requests to the Angular app's 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/todo-frontend/index.html'));
});

// Start the server on a specified port (e.g., 3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
