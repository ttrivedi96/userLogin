import React, { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import Alert from './Components/Alert';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";



function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }
  return (
    <>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container my-3">
          <Routes>
            <Route path="/" element={<Login showAlert={showAlert} />}>
            </Route>
            <Route path="/signup" element={<Signup showAlert={showAlert} />}>
            </Route>
            <Route path="/login" element={<Login showAlert={showAlert} />}>
            </Route>
            <Route path="/profile" element={<Profile />}>
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
