import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx"; 
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/signup.jsx";
import "./App.css";


const routes = (
  <Router>
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Signup />} />

    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}
    
    </div>
  );
};

export default App;
