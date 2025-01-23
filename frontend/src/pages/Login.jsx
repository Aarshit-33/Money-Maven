import React from "react";
// import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		// call login API
		console.log("Username: ", username);
		console.log("Password: ", password);

		// handle login logic here
		if (username === "" || password === "") {
			alert("Please fill in all fields");
			return;
		}

		// Dummy login logic

		const user = await fetch("http://localhost:5000/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		}).then((res) => res.json());

		if (user.error) {
			alert(user.error);
			return;
		}

		// If login is successful, redirect to dashboard
		history.push("/dashboard");

		// Clear the form
		setUsername("");
		setPassword("");
	};

	return (
		<>
			<div className="flex flex-col lg:flex-row items-center justify-around bg-gray-100 dark:bg-gray-900 gap-x-5">
				{/* Form Section */}
				<div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-md rounded-md">
					<h1 className="text-2xl font-bold text-center mb-6 dark:text-green-400 text-green-600">
						Login
					</h1>
					<form>
						<div className="mb-4">
							<label
								htmlFor="username"
								className="block text-sm font-medium mb-2 dark:text-gray-300">
								Username / Email
							</label>
							<input
								type="text"
								id="username"
								placeholder="Enter your username or email"
								className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-400"
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-2 dark:text-gray-300">
								Password
							</label>
							<input
								type="password"
								id="password"
								placeholder="Enter your password"
								className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-400"
							/>
						</div>
						<div className="mb-6 flex items-center justify-between">
							<label className="flex items-center text-sm dark:text-gray-300">
								<input
									type="checkbox"
									className="mr-2 text-green-400 focus:ring-green-400"
								/>
								Remember me
							</label>
						</div>
						<button
							type="submit"
							onClick={handleSubmit}
							className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
							Submit
						</button>
					</form>
				</div>

				{/* Image Section (Visible only on large screens and above) */}
				<div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center bg-green-50">
					<img
						src="../../public/bg.jpg" // Replace this with your image URL
						alt="Login Illustration"
						className="w-full h-auto object-cover"
					/>
				</div>
			</div>
		</>
	);
};

export default Login;
