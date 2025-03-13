const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const multer = require('multer');
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
// const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
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
    files: [{
        file: {
            fieldname: 'file',
            originalname: 'Default_File.MP3',
            encoding: '7bit',
            mimetype: 'audio/mpeg',
            destination: '../public/',
            filename: 'Default_File',
            path: '../public/Default_File.MP3',
            size: 2272889
          },
        fileName: "Default_File.MP3",
        fileID: uuid.v4(),
        fileTranscript: "We're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinkin' of\nYou wouldn't get this from any other guy\nI just wanna tell you how I'm feeling\nGotta make you understand\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nWe've known each other for so long\nYour heart's been aching, but you're too shy to say it\nInside, we both know what's been going on\nWe know the game and we're gonna play it\nAnd if you ask me how I'm feeling\nDon't tell me you're too blind to see\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you",
        fileChatHistory: [{role: "user", content: `The transcript of the file we're going to talk about today is: We're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinkin' of\nYou wouldn't get this from any other guy\nI just wanna tell you how I'm feeling\nGotta make you understand\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nWe've known each other for so long\nYour heart's been aching, but you're too shy to say it\nInside, we both know what's been going on\nWe know the game and we're gonna play it\nAnd if you ask me how I'm feeling\nDon't tell me you're too blind to see\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you`}]
    }]
}

var users = [guestUser];


// ----------------- Backend for the Home Page -----------------


const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
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
            chatHistory: history,
            fileStatus: "success"
        });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get("/audio/:file", (req, res) => {
    const audioSrc = `${__dirname}/uploads/${req.params.file}`;
    res.sendFile(audioSrc);
});

// ----------------- Backend for the Library Page -----------------

const upload = multer({ dest: 'uploads/' });

apiRouter.post('/upload', upload.single('file'), async (req, res) => {
    var user = getUser(req.body.token);
    if (user) {
        const extension = req.file.originalname.split('.').pop();
        const newPath = `${req.file.destination}${req.file.filename}.${extension}`;
        fs.renameSync(req.file.path, newPath);
        try{
            const transcript = await openai.audio.translations.create({
                file: fs.createReadStream(newPath),
                model: "whisper-1"
            });
            const fileObject = {
                file: req.file,
                fileName: req.file.originalname,
                fileID: uuid.v4(),
                fileTranscript: transcript.text,
                fileChatHistory: [{role: "user", content: `The transcript of the file we're going to talk about today is: ${transcript.text}`}]
            }
            user.files.push(fileObject);
        } catch (error) {
            console.error('Error transcribing file:', error.message);
            res.status(400).json({ error: error.message });
            return;
        }
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
    const userName = req.body.userName;
    const user = users.find(u => u.userName === userName);
    if (!user) {
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