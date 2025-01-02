const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Cocktail = sequelize.define('Cocktail', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    recipe: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isBookmarked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: { // Add userId to associate cocktails with a user
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Cocktail;
