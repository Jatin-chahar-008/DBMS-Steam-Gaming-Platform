// YourParentComponent.js

import React from "react";
import Navbar from "../components/Navbar";
import PublisherPage from "../components/PublisherPage";
import DeveloperPage from "../components/DeveloperPage";
import UserPage from "../components/UserPage";
import { Route, Routes } from 'react-router-dom';

const YourParentComponent = () => {
  const [selectedUserType, setSelectedUserType] = React.useState(null);

  const handleUserTypeSelected = (userType) => {
    setSelectedUserType(userType);
  };

  return (
    <div>
      <Navbar onUserTypeSelected={handleUserTypeSelected} />

      <Routes>
        <Route path="/PublisherPage" element={<PublisherPage />} />
        <Route path="/DeveloperPage" element={<DeveloperPage />} />
        <Route path="/UserPage" element={<UserPage />} />
      </Routes>
    </div>
  );
};

export default YourParentComponent;
