const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); 

const app = express();
const port = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'puneet7337',
  database: 'steamgame',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Fetch all genres
app.get('/api/genres', (req, res) => {
  const genres = [
    { GenreId: '301', GenreName: 'First-Person Shooter' },
    { GenreId: '302', GenreName: 'Racing' },
    { GenreId: '303', GenreName: 'Open World' },
  ];

  res.json(genres);
});

// Fetch all games with their genres
app.get('/api/games', (req, res) => {
  db.query('SELECT Game.*, Genre.GenreName FROM Game JOIN Genre ON Game.GenreId = Genre.GenreId', (err, results) => {
    if (err) {
      console.error('Error fetching games:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Associate a game with a publisher and simulate a trigger to associate with a developer
app.post('/api/publishergame', (req, res) => {
  console.log('Received request to /api/publishergame');
  const { PublisherId, GameId } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Insert into publishergame table
    db.query('INSERT INTO publishergame (PublisherId, GameId) VALUES (?, ?)', [PublisherId, GameId], (err, results) => {
      if (err) {
        console.error('Error updating publishergame table:', err);
        db.rollback(() => {
          res.status(500).json({ error: 'Internal Server Error' });
        });
      } else {
        db.query('SELECT DeveloperId FROM Game WHERE GameId = ?', [GameId], (err, developerResults) => {
          if (err) {
            console.error('Error fetching DeveloperId:', err);
            db.rollback(() => {
              res.status(500).json({ error: 'Internal Server Error' });
            });
          } else {
            const DeveloperId = developerResults[0].DeveloperId;
            db.query('INSERT INTO developergame (DeveloperId, GameId) VALUES (?, ?)', [DeveloperId, GameId], (err, results) => {
              if (err) {
                console.error('Error updating developergame table:', err);
                db.rollback(() => {
                  res.status(500).json({ error: 'Internal Server Error' });
                });
              } else {
                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    db.rollback(() => {
                      res.status(500).json({ error: 'Internal Server Error' });
                    });
                  } else {
                    res.json({ success: true });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
});
  

// Add a new game
app.post('/api/games', (req, res) => {
  const { GameName, ReleaseDate, Size, PublisherId, DeveloperId, GenreId, Rating } = req.body;

  db.query(
    'INSERT INTO Game (GameName, ReleaseDate, Size, PublisherId, DeveloperId, GenreId, Rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [GameName, ReleaseDate, Size, PublisherId, DeveloperId, GenreId, Rating],
    (err, results) => {
      if (err) {
        console.error('Error adding a new game:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Associate a game with a developer
app.post('/api/developergame', (req, res) => {
  console.log('Received request to /api/developergame');
  const { DeveloperId, GameId } = req.body;

  db.query('INSERT INTO developergame (DeveloperId, GameId) VALUES (?, ?)', [DeveloperId, GameId], (err, results) => {
    if (err) {
      console.error('Error updating developergame table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Associate a game with a publisher
app.post('/api/publishergame', (req, res) => {
  console.log('Received request to /api/publishergame');
  const { PublisherId, GameId } = req.body;

  db.query('INSERT INTO publishergame (PublisherId, GameId) VALUES (?, ?)', [PublisherId, GameId], (err, results) => {
    if (err) {
      console.error('Error updating publishergame table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// User sign-in
app.post('/api/signin', (req, res) => {
  const { UserId, Password, UserType } = req.body;

  db.query(
    'SELECT * FROM login WHERE UserId = ? AND Password = ? AND UserType = ?',
    [UserId, Password, UserType],
    (err, results) => {
      if (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          res.json({ success: true });
        } else {
          res.json({ success: false, error: 'Invalid credentials' });
        }
      }
    }
  );
});

// Update a game
app.put('/api/games/:GameId', (req, res) => {
  const gameId = req.params.GameId;

  try {
    db.query('UPDATE Game SET Size = ?, GenreId = ? WHERE GameId = ?', [req.body.Size, req.body.GenreId, gameId], (err, results) => {
      if (err) {
        console.error('Error updating the game:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ success: true });
      }
    });
  } catch (error) {
    if (error.code === 'ER_SIGNAL_EXCEPTION') {
      res.status(403).json({ error: error.message });
    } else {
      console.error('Error handling trigger exception:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Delete a game
app.delete('/api/games/:GameId', (req, res) => {
  const gameId = req.params.GameId;
  const publisherId = req.body.publisherId;

  db.query('SELECT * FROM Game WHERE GameId = ? AND PublisherId = ?', [gameId, publisherId], (err, results) => {
    if (err) {
      console.error('Error checking game ownership:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(403).json({ error: 'Unauthorized: Publisher does not own this game' });
    } else {
      db.query('DELETE FROM Game WHERE GameId = ?', [gameId], (err, results) => {
        if (err) {
          console.error('Error deleting the game:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

// Serve the main 'index.html' file for all routes
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
