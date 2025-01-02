import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ username }) => {
    return (
        <div className="p-4 flex flex-wrap justify-between items-center text-white">
            {/* Username */}
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-500 mb-2 sm:mb-0">
                {username}!
            </div>
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-end space-x-2 sm:space-x-4">
                <Link
                    to="/home"
                    className="bg-pink-500 hover:bg-pink-700 text-white py-2 px-4 rounded-lg"
                    title="Go to the Home page"
                >
                    Home
                </Link>
                <Link
                    to="/logged-cocktails"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-lg font-semibold"
                    title="View your cocktail diary"
                >
                    Diary
                </Link>
                <Link
                    to="/bookmarked-cocktails"
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-lg font-semibold"
                    title="View your bookmarked cocktails"
                >
                    Bookmarked
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
