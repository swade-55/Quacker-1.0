const express = require('express');
const path = require('path');
const quackApi = require('./db'); // Import your database operations
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory (or 'src' based on your structure)
app.use(express.static(path.join(__dirname, 'src')));

// Define routes to use your database operations, for example:
app.get('/quacks', async (req, res) => {
  const quacks = await quackApi.getAllQuacks();
  res.json(quacks);
});

// Serve your index.html file at the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/top-quacks', async (req, res) => {
  try {
    const topQuacks = await quackApi.getTopFiveQuacks();
    res.json(topQuacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ... other routes for login, makePost, etc.

// POST route to receive new quack submissions
app.post('/quacks', async (req, res) => {
    try {
      // Here you would handle the incoming quack data
      // For example, you could call a function to save the quack to a database
      const newQuack = await quackApi.addNewQuack(req.body);
      res.status(201).json(newQuack); // Respond with the created quack and a 201 Created status
    } catch (error) {
      // If an error occurs, respond with the error message and a 500 Internal Server Error status
      res.status(500).json({ error: error.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
