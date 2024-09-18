const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/loginDB");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    lastLogin: { type: Date },
    loginHistory: [{ date: Date, success: Boolean }]
});

const User = new mongoose.model('User', userSchema);

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user.username) {return res.status(400).json({ message: 'User does not exist' })};

        function comparePasswords(a, b){
            return a === b;
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            user.loginAttempts += 1;
            user.loginHistory.push({ date: new Date(), success: false });
            await user.save();
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        user.loginAttempts = 0; // reset failed attempts on successful login
        user.lastLogin = new Date();
        user.loginHistory.push({ date: new Date(), success: true });
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'bromosoft', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get Login History
app.get('/history', async (req, res) => {
    //console.log(req.headers)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'bromosoft');
        const user = await User.findById(decoded.userId);
        res.json(user.loginHistory);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.listen(3001, function() {
    console.log("Server started on port 3001");
});

