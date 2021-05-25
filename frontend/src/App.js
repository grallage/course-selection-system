import logo from "./logo.svg";
import "./App.css";
//
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />
    </>
  );
}

export default App;
