const express = require('express');
const router = express.Router();
const Cocktail = require('../models/Cocktail'); 
const authenticate = require('../middleware/authenticate'); 

// Create a new cocktail
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, image, ingredients, recipe, notes, rating, isBookmarked } = req.body;
        const userId = req.user.id; // Extracted from the authentication middleware

        // Use Sequelize to create a new cocktail
        const newCocktail = await Cocktail.create({
            name,
            image,
            ingredients,
            recipe,
            notes,
            rating,
            isBookmarked,
            userId, // Include user ID
        });

        res.status(201).json({ message: 'Cocktail saved successfully', cocktail: newCocktail });
    } catch (error) {
        console.error('Error creating cocktail:', error);
        res.status(500).json({ error: 'Error saving cocktail' });
    }
});

// GET all cocktails for the logged-in user
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from the authentication middleware
        const cocktails = await Cocktail.findAll({ where: { userId } });
        res.json(cocktails);
    } catch (error) {
        console.error('Error fetching cocktails:', error);
        res.status(500).json({ message: 'Error fetching cocktails' });
    }
});

module.exports = router;
