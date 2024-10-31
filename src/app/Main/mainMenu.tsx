import React from "react";
import "./mainMenu.css";

export default function MainMenu() {
  return (
    <div className="main-menu">
      <header className="logo-container">PANDA EXPRESS</header>
      <div className="panel-grid">
        <div className="panel manager">
          <span className="panel-text">Manager</span>
        </div>
        <div className="panel cashier">
          <span className="panel-text">Cashier</span>
        </div>
        <div className="panel customer">
          <span className="panel-text">Customer</span>
        </div>
        <div className="panel menu-board">
          <span className="panel-text">Menu Board</span>
        </div>
      </div>
    </div>
  );
}
