import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaStar, FaSave, FaBookmark } from 'react-icons/fa';

const CocktailDetails = ({ setSavedCocktails }) => {
    const { state } = useLocation();
    const { name, image, ingredients, recipe } = state || {};
    const [notes, setNotes] = useState('');
    const [rating, setRating] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleRating = (star) => setRating(star);

    const handleSave = async () => {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (!token) {
            console.error('Authentication token is missing. Please log in.');
            return;
        }

        try {
            const payload = {
                name,
                image,
                ingredients: ingredients.join(', '),
                recipe,
                notes,
                rating,
                isBookmarked: false, // Ensure the cocktail is no longer bookmarked when saved
            };

            const response = await fetch('http://localhost:5000/api/cocktails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in request headers
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Unauthorized: Please log in.');
                } else if (response.status === 403) {
                    console.error('Forbidden: Your session may have expired. Please log in again.');
                }
                throw new Error(`Failed to save cocktail: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Cocktail saved successfully:', data);

            // Remove the cocktail from the bookmarked list
            setSavedCocktails((prev) => {
                return prev.map((cocktail) =>
                    cocktail.name === name ? { ...cocktail, isBookmarked: false } : cocktail
                );
            });
        } catch (error) {
            console.error('Error saving cocktail:', error.message);
        }
    };

    const handleBookmark = () => {
        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState);

        setSavedCocktails((prev) => {
            const existingCocktail = prev.find((cocktail) => cocktail.name === name);

            if (existingCocktail) {
                // Update the bookmark state of an existing cocktail
                return prev.map((cocktail) =>
                    cocktail.name === name
                        ? { ...cocktail, isBookmarked: newBookmarkState }
                        : cocktail
                );
            } else if (newBookmarkState) {
                // Add the cocktail as bookmarked if not already saved
                return [
                    ...prev,
                    {
                        id: `${name}-${Date.now()}`,
                        name,
                        image,
                        ingredients,
                        recipe,
                        notes: '',
                        rating: 0,
                        isBookmarked: true,
                    },
                ];
            }

            // If unbookmarking, and the cocktail was not already saved, do nothing
            return prev;
        });
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-6">
            <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-4">
                <div className="w-full max-h-48 overflow-hidden rounded-lg mb-4">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">{name}</h2>
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Recipe:</h3>
                    <FaBookmark
                        className={`text-2xl cursor-pointer ${isBookmarked ? 'text-yellow-400' : 'text-gray-500'
                            }`}
                        onClick={handleBookmark}
                    />
                </div>
                <p className="text-gray-300">{recipe}</p>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                    <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, index) => (
                            <span
                                key={index}
                                className="bg-gray-700 text-sm text-white py-1 px-2 rounded-full"
                            >
                                {ingredient}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Notes:</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Log your thoughts about this cocktail..."
                        className="w-full p-3 rounded-lg bg-gray-700 text-gray-300"
                    />
                </div>
                <div className="mt-6 flex items-center">
                    <h3 className="text-lg font-semibold mr-4">Rate this cocktail:</h3>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`text-2xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                            onClick={() => handleRating(star)}
                        />
                    ))}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <button
                        onClick={handleSave}
                        className="bg-pink-500 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
                    >
                        <FaSave className="mr-2" />
                        Save to Diary
                    </button>
                    <Link
                        to="/home"
                        className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold text-center"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CocktailDetails;
