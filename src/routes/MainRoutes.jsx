import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/dashboard/Home/Home";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/auth/login/Login";
import MainLayout from "./MainLayout";
import Chat from "../pages/dashboard/Chats/Chat";
import Notifications from "../pages/dashboard/Notifications/Notifications";
import Contacts from "../pages/dashboard/Contacts/Contacts";
const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="" element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
