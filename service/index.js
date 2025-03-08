const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

var apiRouter = express.Router();
app.use('/api', apiRouter);
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
        token: uuid.v4()
    }
    users.push(user);
    setAuthCookie(res, user.token);


    console.log('New user signup: ' + user.userName);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        displayName: user.displayName
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
                displayName: user.displayName
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

var response = {
    "status": "success",
    "message": "This is another example response\n"
}

apiRouter.get('/response', (req, res) => {
    console.log(response);
    res.send(response.message);
});

apiRouter.post('/question', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });