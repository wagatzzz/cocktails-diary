import React from 'react';
import { Link } from 'react-router-dom';

const CocktailCard = ({ cocktail }) => {
    // Ensure cocktail object exists and has required properties
    if (!cocktail || !cocktail.id || !cocktail.name || !cocktail.image) {
        console.error("CocktailCard received incomplete cocktail data:", cocktail);
        return null; // Don't render if data is invalid
    }

    // Check if ingredients is a string and split it into an array if needed
    const ingredients = Array.isArray(cocktail.ingredients)
        ? cocktail.ingredients
        : cocktail.ingredients ? cocktail.ingredients.split(',').map(ingredient => ingredient.trim()) : [];

    return (
        <Link to={`/cocktail/${cocktail.id}`} state={cocktail}>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <img
                    src={cocktail.image}
                    alt={cocktail.name}
                    className="w-full h-48 object-cover"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{cocktail.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        {ingredients.length > 0 ? (
                            ingredients.map((ingredient, index) => (
                                <span
                                    key={ingredient} // Using ingredient as key, assuming it's unique
                                    className="bg-gray-700 text-sm text-white py-1 px-2 rounded-full"
                                >
                                    {ingredient}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400">No ingredients listed</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CocktailCard;
