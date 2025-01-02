import React from 'react';
import { FaCocktail } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white">
            <div className="relative w-full">
                {/* Left Cocktail Glass */}
                <FaCocktail className="absolute left-4 top-[-30px] text-pink-500 text-4xl md:left-10 md:text-5xl lg:left-16 lg:text-6xl" />
                {/* Right Cocktail Glass */}
                <FaCocktail className="absolute right-4 top-[-30px] text-pink-500 text-4xl md:right-10 md:text-5xl lg:right-16 lg:text-6xl" />
                <h1 className="text-5xl font-bold mb-6 text-center md:text-6xl">COCKTAIL DIARY</h1>
            </div>
            <p className="text-lg mb-12 text-center md:text-xl">Keep a log of your favourite cocktails!</p>
            <div className="flex space-x-4">
                <Link to="/login">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold">
                        Log In
                    </button>
                </Link>
                <Link to="/signup">
                    <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
};


export default LandingPage;
