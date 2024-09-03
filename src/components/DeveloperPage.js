// DeveloperPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeveloperPage.css'; // Import the CSS file

const DeveloperPage = () => {
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);
  const [developerCredentials, setDeveloperCredentials] = useState({
    UserId: '',
    Password: '',
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [developerGames, setDeveloperGames] = useState([]);
  const [updateGame, setUpdateGame] = useState({
    GameId: '',
    Size: '',
    GenreId: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [authenticatedDeveloperId, setAuthenticatedDeveloperId] = useState('');

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

  const authenticateDeveloper = () => {
    // Perform the authentication check with backend
    axios.post('http://localhost:3001/api/signin', {
      UserId: developerCredentials.UserId,
      Password: developerCredentials.Password,
      UserType: 'Developer',
    })
    .then((response) => {
      if (response.data.success) {
        setAuthenticated(true);
        // Set the authenticated developer ID
        setAuthenticatedDeveloperId(developerCredentials.UserId);
        // Fetch and display games associated with the logged-in developer
        fetchDeveloperGames();
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

  const fetchDeveloperGames = () => {
    // Fetch games associated with the logged-in developer
    axios.get(`http://localhost:3001/api/developergame/${developerCredentials.UserId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const gameIds = response.data.map((game) => game.GameId);
  
          // Fetch the details of the associated games
          axios.get(`http://localhost:3001/api/games?gameIds=${gameIds.join(',')}`)
            .then((gamesResponse) => {
              console.log('Games API Response:', gamesResponse.data);
              setDeveloperGames(gamesResponse.data);
            })
            .catch((gamesError) => {
              console.error('Error fetching developer games:', gamesError);
            });
        } else {
          console.error('Invalid response from Developer Games API:', response.data);
          // Log the entire response for further investigation
          console.log('Full API Response:', response);
          // Handle this case as needed, e.g., show an error to the user
        }
      })
      .catch((error) => {
        console.error('Error fetching developer games:', error);
      });
  };

  const handleSeeGames = () => {
    // Fetch and display games associated with the logged-in developer
    fetchDeveloperGames();
    setShowGames(true);
  };

  const handleUpdateGame = () => {
    // Check if the developer is authenticated before allowing game updates
    if (authenticated) {
      setShowForm(true);
    } else {
      alert('Please authenticate first.');
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateGame({
      ...updateGame,
      [e.target.name]: e.target.name === 'GameId' ? parseInt(e.target.value, 10) : e.target.value,
    });
  };

  const handleUpdateSubmit = () => {
    // Omit GameId from the updateGame object before sending the PUT request
    const { GameId, ...updateGameWithoutId } = updateGame;

    console.log('Update Data:', updateGameWithoutId);

    // Send a PUT request to update the game
    axios.put(`http://localhost:3001/api/games/${GameId}`, updateGameWithoutId)
      .then((response) => {
        console.log('Update Response:', response.data);
        if (response.data.success) {
          // Refresh the list of games
          axios.get('http://localhost:3001/api/games')
            .then((response) => {
              setGames(response.data);
            })
            .catch((error) => {
              console.error('Error fetching games:', error);
            });

          // Reset the updateGame state for the next entry
          setUpdateGame({
            GameId: '',
            Size: '',
            GenreId: '',
          });

          // Close the form
          setShowForm(false);
        } else {
          console.error('Error updating the game:', response.data.error);
        }
      })
      .catch((error) => {
        console.error('Error updating the game:', error);
      });
  };

  return (
    <div className="container">
      <h1 className="header">Welcome Developer!</h1>

      {/* Authentication Section */}
      {!authenticated && (
        <div className="form-container">
          <h2>Authentication</h2>
          <label className="form-input">
            User ID:
            <input
              type="text"
              name="UserId"
              value={developerCredentials.UserId}
              onChange={(e) => setDeveloperCredentials({ ...developerCredentials, UserId: e.target.value })}
            />
          </label>
          <label className="form-input">
            Password:
            <input
              type="password"
              name="Password"
              value={developerCredentials.Password}
              onChange={(e) => setDeveloperCredentials({ ...developerCredentials, Password: e.target.value })}
            />
          </label>
          <button type="button" className="form-button" onClick={authenticateDeveloper}>
            Authenticate
          </button>
        </div>
      )}

      {/* Buttons for managing games */}
      {authenticated && (
        <>
          <button className="button" onClick={handleUpdateGame}>
            Update Game
          </button>
          <button className="button" onClick={handleSeeGames}>
            See Games
          </button>
        </>
      )}

      {/* Form for updating a game */}
      {showForm && (
        <div className="form-container">
          <form>
            <label className="form-input">
              Game Id:
              <input type="text" name="GameId" value={updateGame.GameId} onChange={handleUpdateChange} />
            </label>
            <label className="form-input">
              Size:
              <input type="text" name="Size" value={updateGame.Size} onChange={handleUpdateChange} />
            </label>
            <label className="form-input">
              <label htmlFor="genreId">Genre:</label>
              <select
                id="genreId"
                value={updateGame.GenreId}
                onChange={(e) => setUpdateGame({ ...updateGame, GenreId: e.target.value })}
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
            <button type="button" className="form-button" onClick={handleUpdateSubmit}>
              Update
            </button>
          </form>
        </div>
      )}

      {/* Display games associated with the logged-in developer */}
      {showGames && Array.isArray(developerGames) && developerGames.length > 0 && (
        <div className="game-list-container">
          <h2>Your Games</h2>
          <ul>
            {developerGames.map((game) => (
              <li key={game.GameId}>{game.GameName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeveloperPage;
