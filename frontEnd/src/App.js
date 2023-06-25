import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map'
import Header from './pages/Header'
import Details from './pages/Details'
import Activities from './pages/Activities'
import Schedule from './pages/Schedule'
import Pictures from './pages/Pictures'
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/details" element={<Details />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/pictures" element={<Pictures />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
