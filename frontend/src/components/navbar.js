import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";

function NavBar() {
  //TODO: have the user have to sign in and only show search if the the role is admin or employee
  const [role, setRole] = useState()

  useEffect(() => {
    
	}, []);

  function logout(){
    console.log("logout");
    const response = fetch(`http://localhost:5001/logout`, {
      method: "GET",
      credentials: "include",
    });
  }

  return(
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand px-3" href="c-account">TBD's Banking App</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/c-account">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/e-customer-search">Search</a>
            </li>
          </ul>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="btn btn-primary btn-sm me-3 " href="/">Login</a>
          </li>
          <li className="nav-item">
            <button type="button" className="btn btn-danger btn-sm" onClick={logout}>logout</button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;