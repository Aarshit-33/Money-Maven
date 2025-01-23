import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import "./App.css";

function App() {
	return (
		<Router>
			<Navbar />
			<AppRoutes />
			<Footer />
		</Router>
	);
}

export default App;
