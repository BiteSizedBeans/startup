const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
var apiRouter = express.Router();
app.use('/api', apiRouter);


// ----------------- Backend for the Home Page -----------------


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate", async (req, res) => {
    const messages = req.body.messages;
    try{
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
        });
        res.json({ message: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: error.message });
    }
});


// ----------------- Backend for the Login Page -----------------


const authCookieName = 'token';

var users = [];

apiRouter.post('/login', (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).send('Username and password are required');
        return;
    }
    const user = {
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
        displayName: req.body.userName,
        token: uuid.v4(),
        files: []
    }
    users.push(user);
    setAuthCookie(res, user.token);


    console.log('New user signup: ' + user.userName);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        user: user
    });
});

apiRouter.put('/login', async (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).json({
            status: 'error',
            message: 'Username and password are required'
        });
        console.log('Username and password are required');
        return;
    }
    const userName = req.body.userName;

    const user = users.find(u => u.userName === userName);
    if (!user) {
        console.log('Invalid username');
        res.status(401).json({
            status: 'error',
            message: 'Invalid username'
        });
        return;
    } else {
        console.log('Username found');
        if (await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            setAuthCookie(res, user.token);
            res.status(200).json({
                status: 'success',
                message: 'User logged in successfully',
                user: user
            });
        } else {
            console.log('Invalid password');
            res.status(401).json({
                status: 'error',
                message: 'Invalid password'
            });
        }
    }
});

apiRouter.get('/authenticated', (req, res) => {
    const token = getAuthCookie(req);
    const user = users.find(u => u.token === token);
    if (user) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});


function setAuthCookie(res, token) {
    res.cookie(authCookieName, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
}

function getAuthCookie(req) {
    return req.cookies[authCookieName];
}


// ----------------- Backend for the Library Page -----------------


apiRouter.post('/upload', (req, res) => {
    req.body.user.files.push({
        file: req.body.file,
    });
    res.status(200).json({
        status: 'success',
        message: 'File uploaded successfully'
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });