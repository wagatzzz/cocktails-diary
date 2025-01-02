import React, { useState } from 'react';
import { FaCocktail } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }
    
        setIsLoading(true);
    
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('name', result.name);  // Storing name from the response
                navigate('/home');
            } else {
                setError(result.message || 'Login failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    
    

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white">
            <div className="relative w-full mb-8">
                <FaCocktail className="absolute left-4 top-[-30px] text-pink-500 text-4xl" />
                <FaCocktail className="absolute right-4 top-[-30px] text-pink-500 text-4xl" />
                <h1 className="text-5xl font-bold text-center">Log In</h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            >
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
                        placeholder="Enter your password"
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold ${isLoading && 'opacity-50 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
                <div className="mt-4 text-center">
                    <a href="/signup" className="text-blue-400 hover:underline">
                        signup instead
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
