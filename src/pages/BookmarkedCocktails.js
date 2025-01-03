import React from 'react';
import CocktailCard from '../components/CocktailCard';
import Navbar from '../components/Navbar';

const BookmarkedCocktails = ({ savedCocktails }) => {
    
    const bookmarkedCocktails = savedCocktails.filter((cocktail) => cocktail.isBookmarked);
     // Retrieve the username from localStorage
     const username = localStorage.getItem('name') || 'Guest';  // Default to 'Guest' if not found

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {/* Pass username to Navbar */}
            <Navbar username={username} />


            <h2 className="text-3xl font-bold mb-6 mt-6 text-center">Bookmarked Cocktails</h2>
            {bookmarkedCocktails.length === 0 ? (
                <p className="text-center text-gray-400">No cocktails bookmarked yet! Start exploring and bookmarking your favorites.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    {bookmarkedCocktails.map((cocktail, index) => (
                        <CocktailCard
                            key={cocktail.id || `${cocktail.name}-${index}`}
                            cocktail={{ ...cocktail, id: cocktail.id || `${cocktail.name}-${index}` }} // Ensure unique ID
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookmarkedCocktails;
