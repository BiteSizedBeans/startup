const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const multer = require('multer');
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const DB = require('./database.js');
const { WebSocketServer } = require('ws');
const http = require('http');
const app = express();
const peerProxy = require('./peerProxy.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
var apiRouter = express.Router();
app.use('/api', apiRouter);


// ----------------- Backend for the Home Page -----------------


const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

app.post("/api/generate", async (req, res) => {
    const token = req.body.token;
    const user = await DB.findUser(token);
    const message = req.body.message;
    const fileIndex = user.files.findIndex(f => f.fileID === req.body.file.fileID);
    const history = user.files[fileIndex].fileChatHistory;
    try{
        history.push({role: "user", content: message});
        await DB.updateFileChatHistory(user.userName, req.body.file.fileID, history);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: history,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const reply = response.choices[0].message.content.trim();
        history.push({role: "assistant", content: reply});
        await DB.updateFileChatHistory(user.userName, req.body.file.fileID, history);

        res.json({
            fileChatHistory: history,
            fileStatus: "success"
        });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get("/audio/:file", (req, res) => {
    const audioSrc = `${__dirname}/service/uploads/${req.params.file}`;
    res.sendFile(audioSrc);
});

// ----------------- Backend for the Library Page -----------------

const upload = multer({ dest: 'service/uploads/' });

apiRouter.post('/upload', upload.single('file'), async (req, res) => {
    var user = await DB.findUser(req.body.token);
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
            await DB.addFiles(user, fileObject);

            broadcastNotification({
                type: 'fileUpload',
                message: `${user.userName} uploaded a new file: ${req.file.filename}`
            })
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

apiRouter.get('/files', async (req, res) => {
    const authHeader = req.headers.authorization;
    let token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    const user = await DB.findUser(token);
    res.status(200).json({
        files: user.files
    });
});

apiRouter.get('/notifications', async (req, res) => {
    const authHeader = req.headers.authorization;
    let token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }   
    const user = await DB.findUser(token);
    res.status(200).json({
        notifications: user.notifications
    });
});

// ----------------- Backend for the Login Page -----------------


const authCookieName = 'token';

apiRouter.post('/login', async (req, res) => {
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
    await DB.addUser(user);
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
    const user = await DB.findByUserName(userName);
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
            await DB.updateUserToken(user.userName, user.token);
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

apiRouter.get('/authenticated', async (req, res) => {
    const token = getAuthCookie(req);
    const user = await DB.findUser(token);
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


const httpServer = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

peerProxy(httpServer);