import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import HomePage from './HomePage';
import CocktailDetails from './CocktailDetails';
import LoggedCocktails from './LoggedCocktails';
import BookmarkedCocktails from './BookmarkedCocktails'; // Import the new component

const App = () => {
    const [savedCocktails, setSavedCocktails] = useState([]); // Central state for saved cocktails
    const [error, setError] = useState(''); // State for managing errors

    // Fetch cocktails data when the component mounts
    useEffect(() => {
        const fetchCocktails = async () => {
            const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

            if (!token) {
                setError('User is not authenticated.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/cocktails', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Unauthorized access. Please log in.');
                    } else if (response.status === 403) {
                        setError('Forbidden. Your session may have expired. Please log in again.');
                    } else {
                        setError(`Failed to fetch cocktails: ${response.statusText}`);
                    }
                    return;
                }
                

                const data = await response.json();
                setSavedCocktails(data); // Set fetched data into state
            } catch (err) {
                console.error('Error fetching cocktails:', err);
                setError(err.message);
            }
        };

        fetchCocktails();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage savedCocktails={savedCocktails} />} />
            <Route
                path="/cocktail/:id" // Dynamic URL with cocktail ID
                element={<CocktailDetails setSavedCocktails={setSavedCocktails} />}
            />
            <Route
                path="/logged-cocktails"
                element={<LoggedCocktails savedCocktails={savedCocktails} />}
            />
            <Route
                path="/bookmarked-cocktails" // Route for bookmarked cocktails
                element={<BookmarkedCocktails savedCocktails={savedCocktails} />}
            />
        </Routes>
    );
};

export default App;
