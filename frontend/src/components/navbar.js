import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";

function NavBar() {
  return(
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand px-3" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/c-account">Account</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/e-customer-search">Search</a>
            </li>
          </ul>
        </div>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link me-3" href="/login">Login</a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;