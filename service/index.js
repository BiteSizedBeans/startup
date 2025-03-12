const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const multer = require('multer');
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
// const { MongoClient } = require('mongodb');
// const config = require('./dbConfig.json');
// const { register } = require('module');

// const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// const client = new MongoClient(url);
// const db = client.db('users');
// const collection = db.collection('users');

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
var apiRouter = express.Router();
app.use('/api', apiRouter);

const guestUser = {
    userName: 'guest',
    password: 'guest',
    displayName: 'Guest',
    token: 'guest',
    files: []
}

var users = [guestUser];


// ----------------- Backend for the Home Page -----------------


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate", async (req, res) => {
    const token = req.body.token;
    const user = users.find(u => u.token === token);
    const message = req.body.message;
    const fileIndex = user.files.findIndex(f => f.fileID === req.body.file.fileID);
    const history = user.files[fileIndex].fileChatHistory;
    try{
        history.push({role: "user", content: message});
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: history,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const reply = response.choices[0].message.content.trim();
        history.push({role: "assistant", content: reply});

        res.json({
            chatHistory: history
        });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get("/audio/:file", (req, res) => {
    const file = req.params.file.substring(0, req.params.file.indexOf('.'));
    const audioSrc = `${__dirname}/uploads/${file}`;
    res.sendFile(audioSrc);
});

// ----------------- Backend for the Library Page -----------------

const upload = multer({ dest: 'uploads/' });

apiRouter.post('/upload', upload.single('file'), async (req, res) => {
    const user = getUser(req.body.token);
    if (user) {
        console.log(req.file);
        const extension = req.file.originalname.split('.').pop();
        const newPath = `${req.file.destination}${req.file.filename}.${extension}`;
        fs.renameSync(req.file.path, newPath);
        console.log(newPath);
        const transcript = await openai.audio.translations.create({
            file: fs.createReadStream(newPath),
            model: "whisper-1"
        });
        console.log(transcript);
        const fileObject = {
            file: req.file,
            fileName: req.file.originalname,
            fileID: uuid.v4(),
            fileTranscript: transcript.text,
            fileChatHistory: []
        }
        user.files.push(fileObject);
    res.status(200).json({
        status: 'success',
            message: `File ${req.file.filename} uploaded by user ${user.userName}`
        });
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
});

apiRouter.get('/files', (req, res) => {
    const authHeader = req.headers.authorization;
    let token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    const user = getUser(token);
    res.status(200).json({
        files: user.files
    });
});


// ----------------- Backend for the Login Page -----------------


const authCookieName = 'token';

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
            console.log(`User ${user.userName} logged in successfully`);
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

function getUser(token) {
    return users.find(u => u.token === token);
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });