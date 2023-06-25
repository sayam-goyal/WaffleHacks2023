import React from 'react';
import Button from "../components/Button.js"
import 'bootstrap/dist/css/bootstrap.css';

function Home() {
  if(localStorage.getItem("vacType") === "select"){
    alert("Please select a vacation type");
    localStorage.removeItem("vacType");
  }
  return (
    <div>
      <h1 className="Head">Travel Planner</h1>
      <div className="grid-container">
        <Button image="images/tropical.png" name="Tropical"/>
        <Button image="images/winter.png" name="Winter"/>
      </div>
      <div className="grid-container">
        <Button image="images/adventure.png" name="Adventure"/>
        <Button image="images/city.png" name="City"/>
      </div>
    </div>
  );
}

export default Home;