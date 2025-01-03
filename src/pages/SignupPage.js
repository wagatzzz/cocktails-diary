import React, { useState } from 'react';
import { FaCocktail } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                // Store the token and the username
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('name', formData.name);  
                navigate('/home');
            } else {
                setError(result.message || 'Sign up failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };
    

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white">
            <div className="relative w-full mb-8">
                <FaCocktail className="absolute left-4 top-[-30px] text-pink-500 text-4xl" />
                <FaCocktail className="absolute right-4 top-[-30px] text-pink-500 text-4xl" />
                <h1 className="text-5xl font-bold text-center">Sign Up</h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            >
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Create a password"
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold"
                >
                    Sign Up
                </button>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-green-400 hover:underline">
                        login instead
                    </a>
                </div>
            </form>
        </div>
    );
};

export default SignupPage;
