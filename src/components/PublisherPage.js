// PublisherPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublisherPage.css'; // Import the CSS file

const PublisherPage = () => {
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);

  const [publisherCredentials, setPublisherCredentials] = useState({
    UserId: '', // Replace with actual UserId for Publisher
    Password: '', // Replace with actual Password for Publisher
  });

  const [authenticated, setAuthenticated] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    gameId: '',
    confirmation: false,
  });

  const [newGame, setNewGame] = useState({
    GameName: '',
    ReleaseDate: '',
    Size: '',
    PublisherId: '', // Replace with actual PublisherId
    DeveloperId: '', // Replace with actual DeveloperId
    GenreId: '', // Replace with actual GenreId
    Rating: 5, // Default Rating
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch the list of genres when the component mounts
    axios.get('http://localhost:3001/api/genres')
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of games when the component mounts
    axios.get('http://localhost:3001/api/games')
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching games:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  const handleAddGame = () => {
    // Check if the publisher is authenticated before allowing game addition
    if (authenticated) {
      setShowForm(true);
    } else {
      alert('Please authenticate first.');
    }
  };

  const handleDeleteGame = () => {
    const gameId = prompt('Enter the GameId of the game to delete:');

    if (gameId) {
      axios.delete(`http://localhost:3001/api/games/${gameId}`)
        .then((response) => {
          if (response.data.success) {
            axios.get('http://localhost:3001/api/games')
              .then((response) => {
                setGames(response.data);
              })
              .catch((error) => {
                console.error('Error fetching games:', error);
              });

            alert('Game deleted successfully!');
          } else {
            console.error('Error deleting game:', response.data.error);
          }
        })
        .catch((error) => {
          console.error('Error deleting game:', error);
        });
    }
  };

  const handleChange = (e) => {
    setNewGame({
      ...newGame,
      [e.target.name]: e.target.name === 'GameId' ? parseInt(e.target.value, 10) : e.target.value,
    });
  };

  const handleSubmit = () => {
    // Set a default value for Rating (e.g., 5)
    const defaultRating = 5;

    // Set the 'Rating' field to the default value before sending the POST request
    setNewGame({
      ...newGame,
      Rating: defaultRating,
    });

    // Omit GameId from the newGame object before sending the POST request
    const { GameId, ...newGameWithoutId } = newGame;

    // Send a POST request to add a new game
    axios.post('http://localhost:3001/api/games', newGameWithoutId)
      .then((response) => {
        if (response.data.success) {
          // Refresh the list of games
          axios.get('http://localhost:3001/api/games')
            .then((response) => {
              setGames(response.data);
            })
            .catch((error) => {
              console.error('Error fetching games:', error);
            });

          // Update the developergame table
          axios.post('http://localhost:3001/api/developergame', {
            DeveloperId: newGame.DeveloperId,
            GameId: response.data.insertId, // Use the newly inserted GameId
          })
            .then((response) => {
              // Handle the response if needed
            })
            .catch((error) => {
              console.error('Error updating developergame table:', error);
            });

          // Update the publishergame table
          axios.post('http://localhost:3001/api/publishergame', {
            PublisherId: newGame.PublisherId,
            GameId: response.data.insertId, // Use the newly inserted GameId
          })
            .then((response) => {
              // Handle the response if needed
            })
            .catch((error) => {
              console.error('Error updating publishergame table:', error);
            });

          // Reset the newGame state for the next entry
          setNewGame({
            GameName: '',
            ReleaseDate: '',
            Size: '',
            PublisherId: '',
            DeveloperId: '',
            GenreId: '',
          });

          // Close the form
          setShowForm(false);
        } else {
          console.error('Error adding a new game:', response.data.error);
        }
      })
      .catch((error) => {
        console.error('Error adding a new game:', error);
      });
  };

  // Authentication function for Publisher
  const authenticatePublisher = () => {
    // Perform the authentication check with backend
    axios.post('http://localhost:3001/api/signin', {
      UserId: publisherCredentials.UserId,
      Password: publisherCredentials.Password,
      UserType: 'Publisher', // Replace with actual UserType for Publisher
    })
    .then((response) => {
      if (response.data.success) {
        setAuthenticated(true);
      } else {
        // Authentication failed
        alert('Invalid credentials. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Error during authentication:', error);
      alert('Error during authentication. Please try again.');
    });
  };

  return (
    <div className="container">
      <h1 className="header">Welcome Publisher!</h1>

      {/* Authentication Section */}
      {!authenticated && (
        <div className="form-container">
          <h2>Authentication</h2>
          <label className="form-input">
            User ID:
            <input
              type="text"
              name="UserId"
              value={publisherCredentials.UserId}
              onChange={(e) => setPublisherCredentials({ ...publisherCredentials, UserId: e.target.value })}
            />
          </label>
          <label className="form-input">
            Password:
            <input
              type="password"
              name="Password"
              value={publisherCredentials.Password}
              onChange={(e) => setPublisherCredentials({ ...publisherCredentials, Password: e.target.value })}
            />
          </label>
          <button type="button" className="form-button" onClick={authenticatePublisher}>
            Authenticate
          </button>
        </div>
      )}

      {/* Button for managing games */}
      {authenticated && (
          <div className="button-container">
            <button className="button" onClick={handleAddGame}>
                Add New Game
              </button>
              <button className="button delete-button" onClick={() => setDeleteForm({ confirmation: true })}>
                Delete Game
            </button>
        </div>
      )}

        
      {/* Delete Game Form */}
      {deleteForm.confirmation && (
        <div className="form-container">
          <h2>Delete Game</h2>
          <label className="form-input">
            Game ID:
            <input
              type="text"
              name="gameId"
              value={deleteForm.gameId}
              onChange={(e) => setDeleteForm({ ...deleteForm, gameId: e.target.value })}
            />
          </label>
          <button type="button" className="form-button" onClick={handleDeleteGame}>
            Delete
          </button>
        </div>
      )}


      {/* Form for adding a new game */}
      {showForm && (
        <div className="form-container">
          <form>
            {/* ... (existing form elements) */}
            <label className="form-input">
              Game Name:
              <input type="text" name="GameName" value={newGame.GameName} onChange={handleChange} />
            </label>
            <label className="form-input">
              Release Date:
              <input type="date" name="ReleaseDate" value={newGame.ReleaseDate} onChange={handleChange} />
            </label>
            <label className="form-input">
              Size:
              <input type="text" name="Size" value={newGame.Size} onChange={handleChange} />
            </label>
            <label className="form-input">
              Publisher Id:
              <input type="text" name="PublisherId" value={newGame.PublisherId} onChange={handleChange} />
            </label>
            <label className="form-input">
              Developer Id:
              <input type="text" name="DeveloperId" value={newGame.DeveloperId} onChange={handleChange} />
            </label>
            <label className="form-input">
              Rating:
              <input type="number" name="Rating" value={newGame.Rating} onChange={handleChange} />
            </label>
            <label className="form-input">
              <label htmlFor="genreId">Genre:</label>
              <select
                id="genreId"
                value={newGame.GenreId}
                onChange={(e) => setNewGame({ ...newGame, GenreId: e.target.value })}
              >
                <option value="" disabled>
                  Select Genre
                </option>
                {genres.map((genre) => (
                  <option key={genre.GenreId} value={genre.GenreId}>
                    {genre.GenreName}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="form-button" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PublisherPage;
