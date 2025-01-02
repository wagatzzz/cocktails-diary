const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cocktailRoutes = require('./routes/cocktails'); 
const sequelize = require('./config/database');

require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});



// Sync the database
sequelize.sync({ alter: true }) // Will update the schema automatically
    .then(() => console.log('Database schema updated!'))
    .catch(err => console.error('Error syncing database:', err));



db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.use('/api/cocktails', cocktailRoutes);


// Register User
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        
        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Error creating user' });
            }

            // Fetch the newly created user from the database
            const user = {
                id: result.insertId,
                name: name,
                email: email
            };

            // Create JWT token for the new user
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ message: 'User created successfully', token });  // Send token in the response
        });

    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});




// Login User
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching user' });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = result[0]; // Assuming the email is unique and only one result is returned

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate the token with user id and send both token and user name
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, name: user.name });  // Include name in the response
    });
});






// Get Bookmarked Cocktails
app.get('/bookmarked/:user_id', (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT * FROM cocktails WHERE user_id = ? AND is_bookmarked = TRUE';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(400).send('Error fetching bookmarks');
        res.status(200).json(results);
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
