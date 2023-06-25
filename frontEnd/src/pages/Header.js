import { Outlet, Link, NavLink } from "react-router-dom";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

function Header() {
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark">
    <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/details">Trip Details</NavLink>
          <NavLink className="nav-link" to="/map">Map</NavLink>
          <NavLink className="nav-link" to="/activities">Activities and Restaurants</NavLink>
          <NavLink className="nav-link" to="/schedule">Schedule and Total Cost</NavLink>
          <NavLink className="nav-link" to="/pictures">Pictures</NavLink>
        </div>
      </div>
    </div>
    </nav>

    <Outlet />
    </div>
  );
};

export default Header;