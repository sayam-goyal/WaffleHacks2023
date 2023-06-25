import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youth: 0,
      adults: 0,
      elderly: 0,
      budget: 0,
      arrival: new Date(),
      departure: new Date()
    };

    this.changeYouth = this.changeYouth.bind(this);
    this.changeAdults = this.changeAdults.bind(this);
    this.changeElderly = this.changeElderly.bind(this);
    this.changeBudget = this.changeBudget.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    localStorage.setItem('youth', 0);
    localStorage.setItem('adults', 0);
    localStorage.setItem('elderly', 0);
  }

  changeYouth(event) {
    this.setState({ youth: event.target.value });
    localStorage.setItem('youth', event.target.value);
  }

  changeAdults(event) {
    this.setState({ adults: event.target.value });
    localStorage.setItem('adults', event.target.value);
  }

  changeElderly(event) {
    this.setState({ elderly: event.target.value });
    localStorage.setItem('elderly', event.target.value);
  }

  changeBudget(event) {
    if (event.target.value.length === 1) {
      this.setState({ budget: 0 });
      return;
    }
    let num = parseInt(event.target.value.substring(1).replaceAll(',', ''));
    if (isNaN(num)) return;
    this.setState({ budget: num });
    localStorage.setItem('budget', event.target.value);
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  setStartDate(event){
    this.setState({arrival: event.target.value})
    localStorage.setItem('arrival', event.target.value);
  }

  setEndDate(event){
    this.setState({departure: event.target.value})
    localStorage.setItem('departure', event.target.value);
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <div className="grid-container2">
          <label>Youth</label>
          <label>Adults</label>
          <label>Elderly</label>
        </div>
        <div className="grid-container3">
          <input type="number" value={this.state.youth} onChange={this.changeYouth} />
          <input type="number" value={this.state.adults} onChange={this.changeAdults} />
          <input type="number" value={this.state.elderly} onChange={this.changeElderly} />
        </div>
        <div className="grid-container">
          Budget
        </div>
        <div className="grid-container3">
          <input type="text" value={"$" + Number(this.state.budget).toLocaleString()} onChange={this.changeBudget} />
        </div>
        <div className="grid-container2">
          <label>Arrival Date</label>
          <label>Departure Date</label>
        </div>
        <div className="grid-container4">
            <input type="date" value={this.state.arrival} onChange={this.setStartDate}/>
            <input type="date" value={this.state.departure} onChange={this.setEndDate}/>
        </div>
      </form>
      </div>
    );
  }
}

export default Details;
