import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeveloperPage from './DeveloperPage';
import PublisherPage from './PublisherPage';

const SignInModal = ({ onClose }) => {
  const [userType, setUserType] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // Use navigate from react-router-dom
  const navigate = useNavigate();

  const handleAction = () => {
    // Validate mandatory fields
    if ((!isSignUp && !userType) || !id || !password) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    // Add your sign-in or sign-up logic here
    if (isSignUp) {
      console.log('Signing up with UserType: signup');
    } else {
      console.log('Signing in with UserType:', userType);
    }

    console.log('ID:', id);
    console.log('Password:', password);

    console.log('User Type:', userType);
    console.log('Is Sign Up:', isSignUp);
    // Redirect based on user type
    if (userType === 'user') {
      // Redirect to the same page for User
      console.log('Redirecting to User Page');
      // Implement your redirection logic here for User
    } else if (userType === 'developer') {
      // Redirect to DeveloperPage for Developer
      navigate('/developer');
    } else if (userType === 'publisher') {
      // Redirect to PublisherPage for Publisher
      navigate('/PublisherPage');
    }

    // Close the modal after action
    onClose();
  };

  // ... (rest of your component)

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-md">
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            X
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-4">Sign In</h2>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            User Type*:
          </label>
          <select
            className="mt-1 p-2 w-full border rounded"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            disabled={isSignUp} // Disable the dropdown when Sign Up is checked
          >
            <option value="" disabled>
              Select
            </option>
            <option value="user">User</option>
            <option value="developer">Developer</option>
            <option value="publisher">Publisher</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Sign Up
          </label>
          <input
            type="checkbox"
            checked={isSignUp}
            onChange={() => setIsSignUp(!isSignUp)}
            className="mt-1"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            ID*:
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password*:
          </label>
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="bg-[#5c7e10] text-white px-4 py-2 rounded hover:bg-[#4e6e0c] cursor-pointer"
          onClick={handleAction}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default SignInModal;
