import React, { useState } from 'react';
import { FaCocktail } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  
import Navbar from '../components/Navbar';
import CocktailCard from '../components/CocktailCard';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchActive, setSearchActive] = useState(false);
    const [cocktails, setCocktails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Retrieve the username from localStorage
    const username = localStorage.getItem('name') || 'Guest';  // Default to 'Guest' if not found

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Please enter a valid search term.');
            return;
        }

        setLoading(true);
        setError(''); 
        setSearchActive(true);

        try {
            const [nameResponse, ingredientResponse] = await Promise.all([
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`),
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchQuery}`)
            ]);

            const nameData = await nameResponse.json();
            const ingredientData = await ingredientResponse.json();

            const nameCocktails = nameData.drinks || [];
            const ingredientCocktails = ingredientData.drinks || [];

            const seenIds = new Set();
            const combinedCocktails = [
                ...nameCocktails,
                ...ingredientCocktails,
            ].filter((drink) => {
                if (seenIds.has(drink.idDrink)) return false;
                seenIds.add(drink.idDrink);
                return true;
            });

            if (combinedCocktails.length > 0) {
                const formattedCocktails = combinedCocktails.map((drink) => ({
                    id: drink.idDrink,
                    name: drink.strDrink,
                    image: drink.strDrinkThumb,
                    ingredients: Object.keys(drink)
                        .filter((key) => key.startsWith('strIngredient') && drink[key])
                        .map((key) => drink[key]),
                    recipe: drink.strInstructions || 'No recipe available.',
                    isBookmarked: false,
                }));
                setCocktails(formattedCocktails);
            } else {
                setCocktails([]);
                setError('No cocktails found for your search.');
            }
        } catch (error) {
            setError('Unable to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear the token
        localStorage.removeItem('username'); // Clear the username
        navigate('/'); // Navigate to the landing page
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {/* Pass username to Navbar */}
            <Navbar username={username} />

            <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4">
                {/* Left and Right Cocktail Icons */}
                {!searchActive && (
                    <>
                        <FaCocktail
                            className="absolute left-4 sm:left-6 top-1/3 text-pink-500 text-4xl sm:text-5xl transform -translate-y-1/2 lg:left-16 lg:text-6xl"
                        />
                        <FaCocktail
                            className="absolute right-4 sm:right-6 top-1/3 text-pink-500 text-4xl sm:text-5xl transform -translate-y-1/2 lg:right-16 lg:text-6xl"
                        />
                    </>
                )}

                {/* Title and Description */}
                {!searchActive && (
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-6">COCKTAIL DIARY</h1>
                        <p className="text-lg sm:text-xl">Search and log your favorite cocktails</p>
                    </div>
                )}

                {/* Search Bar */}
                <div className={`flex w-full max-w-lg ${searchActive ? 'mt-4' : ''}`}>
                    <input
                        type="text"
                        placeholder="Search name or ingredient of cocktail"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 px-4 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-pink-500 hover:bg-pink-700 text-white py-3 px-6 rounded-r-lg font-semibold"
                    >
                        Search
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 mt-2 rounded"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && <p className="text-gray-400 mt-4">Loading...</p>}

                {/* Cocktail Grid */}
                {searchActive && !loading && cocktails.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 w-full px-4">
                        {cocktails.map((cocktail) => (
                            <CocktailCard key={cocktail.id} cocktail={cocktail} />
                        ))}
                    </div>
                )}

                {/* No Results Message */}
                {searchActive && !loading && cocktails.length === 0 && (
                    <p className="text-gray-400 mt-4">No results found.</p>
                )}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold mt-6"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;
