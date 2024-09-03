import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css'; // Import the CSS file

const UserPage = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [gameDetails, setGameDetails] = useState(null);
  const [sysReq, setSysReq] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch the list of games when the component mounts
    axios.get('http://localhost:3001/api/games')
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching games:', error);
      });
  }, []);


  const handleLogin = () => {
    // Replace this URL with your authentication endpoint for users
    const authenticationEndpoint = 'http://localhost:3001/api/signin';

    // Make a request to the authentication endpoint
    axios.post(authenticationEndpoint, {
      UserId: userId,
      Password: password,
      UserType: 'User', // Replace with actual UserType for User
    })
      .then((response) => {
        if (response.data.success) {
          // Authentication successful
          setIsLoggedIn(true);
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


  const handleSysReq = (gameId) => {
    // Fetch system requirements for the selected game
    axios.get(`http://localhost:3001/api/sysreq/${gameId}`)
      .then((response) => {
        // Set the fetched system requirements in the state
        setSysReq(response.data);
      })
      .catch((error) => {
        console.error('Error fetching system requirements:', error);
      });
  };

  const handleGameDetails = (gameId) => {
    // Fetch real details for the selected game
    axios.get(`http://localhost:3001/api/gameDetails/${gameId}`)
      .then((response) => {
        // Set the fetched details in the state
        setGameDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching game details:', error);
      });
  };
  const handleBuyGame = (gameId) => {
    // Implement the logic for buying the game
    // This is a placeholder. You need to add your own logic here.
    console.log(`Buying game with ID ${gameId}`);
    // Add your logic to handle the purchase
  };
  
  const handleGameClick = (game) => {
    setSelectedGame(game);
    setGameDetails(null);
    setSysReq(null); // Reset system requirements when selecting a new game
  
    // Fetch system requirements for the selected game
    
    axios.get(`http://localhost:301/api/sysreq/${game.GameId}`)
      .then((response) => {
        // Handle the response as needed
        console.log('System Requirements API Response:', response.data);
        
        // Set the fetched system requirements in the state
        setSysReq(response.data);
  
        // Fetch real details for the selected game
        handleGameDetails(game.GameId);
      })
      .catch((error) => {
        console.error('Error fetching system requirements:', error);
      });
      
      const hardcodedSysReq = {
        OS: 'Windows 10',
        Storage: '50 GB',
      };

      // Set the hardcoded system requirements in the state
      setSysReq(hardcodedSysReq);
    
      // Fetch real details for the selected game
      handleGameDetails(game.GameId);
  };
  

  const handleBuyClick = () => {
    // Show the buy form
    setShowBuyForm(true);
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleBuySubmit = () => {
    // Validate payment details (you may want to add more validation)
    if (paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv) {
      // Perform the payment processing logic here
      // ...

      // Assume the payment is successful and add the game to the user's owned games
      alert('Payment successful! The game has been added to your owned games.');

      // Close the buy form
      setShowBuyForm(false);
    } else {
      alert('Please provide valid payment details.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1 className="header">Login</h1>
        <label>
          User ID:
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">Welcome User!</h1>

      {/* Display the list of games */}
      <ul>
        {games.map((game) => (
          <li key={game.GameId}>
            {game.GameName}
            <button onClick={() => handleGameClick(game)}>View Details</button>
          </li>
        ))}
      </ul>

      {/* Display details of the selected game */}
      {selectedGame && (
        <div className="selected-game">
            <h2>{selectedGame.GameName}</h2>
            {/* Display other details, e.g., system requirements */}
            <p>System Requirements:</p>
            {/* Display the View and Buy buttons */}
            <div>
            <button onClick={() => handleBuyClick(selectedGame.GameId)}>Buy</button>
            </div>
            {/* Display the system requirements */}
            {sysReq && (
            <div className="sys-req">
                <h2>{selectedGame.GameName} System Requirements</h2>
                <table>
                <thead>
                    <tr>
                    <th>OS</th>
                    <th>Storage</th>
                    {/* Add other columns as needed */}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{sysReq.OS}</td>
                    <td>{sysReq.Storage}</td>
                    {/* Add other cells as needed */}
                    </tr>
                </tbody>
                </table>
            </div>
            )}
        </div>
)}
      


      {/* Buy Form */}
      {showBuyForm && selectedGame && (
        <div className="buy-form">
          <h3>Buy {selectedGame.GameName}</h3>
          <label>
            Card Number:
            <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} />
          </label>
          <label>
            Expiry Date:
            <input type="text" name="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentChange} />
          </label>
          <label>
            CVV:
            <input type="text" name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} />
          </label>
          <button onClick={handleBuySubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default UserPage;
