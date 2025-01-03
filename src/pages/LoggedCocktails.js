import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const LoggedCocktails = () => {
    const [cocktails, setCocktails] = useState([]);
    const [error, setError] = useState('');

     // Retrieve the username from localStorage
     const username = localStorage.getItem('name') || 'Guest';  // Default to 'Guest' if not found

    useEffect(() => {
        const fetchCocktails = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Authentication token is missing. Please log in.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/cocktails', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 403) {
                        setError(errorData.message || 'Access forbidden. Please log in again.');
                    } else {
                        setError('Failed to fetch cocktails. Please try again.');
                    }
                    return;
                }

                const data = await response.json();
                setCocktails(data);
            } catch (error) {
                setError('An error occurred while fetching cocktails.');
                console.error('Error fetching cocktails:', error);
            }
        };

        fetchCocktails();
    }, []);



    const sortedCocktails = cocktails.sort((a, b) => b.rating - a.rating);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
             {/* Pass username to Navbar */}
             <Navbar username={username} />

            <h2 className="text-3xl font-bold mb-6 mt-6 text-center">Logged Cocktails</h2>
            {error ? (
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    {error.includes('Please log in') && (
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            onClick={() => {
                                localStorage.removeItem('authToken');
                                window.location.href = '/login'; // Redirect to login page
                            }}
                        >
                            Log In Again
                        </button>
                    )}
                </div>
            ) : cocktails.length === 0 ? (
                <p className="text-center text-gray-400">No cocktails logged yet!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {sortedCocktails.map((cocktail) => (
                        <div key={cocktail.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-start">
                            <h3 className="text-xl font-bold mb-2">{cocktail.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {cocktail.ingredients.split(', ').map((ingredient, idx) => (
                                    <span key={idx} className="bg-gray-700 text-sm text-white py-1 px-2 rounded-full">
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4">
                                <strong>Notes:</strong> {cocktail.notes}
                            </p>
                            <div className="flex items-center">
                                <strong className="mr-2">Rating:</strong>
                                {[...Array(cocktail.rating)].map((_, idx) => (
                                    <span key={idx} className="text-yellow-400">★</span>
                                ))}
                                {[...Array(5 - cocktail.rating)].map((_, idx) => (
                                    <span key={idx} className="text-gray-500">★</span>
                                ))}
                                <span className="ml-4">
                                    {cocktail.isBookmarked ? (
                                        <span className="text-yellow-500">★ Bookmarked</span>
                                    ) : (
                                        <span className="text-gray-400">☆ Not Bookmarked</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LoggedCocktails;
