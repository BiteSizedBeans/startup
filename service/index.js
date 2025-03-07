const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.use(express.json());

var apiRouter = express.Router();
app.use('/api', apiRouter);

var displayName = '';
var isLoggedIn = false;

var userNames = [];
var passwords = [];

apiRouter.post('/login', (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).send('Username and password are required');
        return;
    }
    userName = req.body.userName;
    password = req.body.password;
    passwordHash = bcrypt.hashSync(password, 10);
    userNames.push(userName);
    passwords.push(passwordHash);
    displayName = userName;
    isLoggedIn = true;

    console.log('New user signup: ' + userName);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        displayName: displayName,
        isLoggedIn: isLoggedIn
    });
});

apiRouter.put('/login', async (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).json({
            status: 'error',
            message: 'Username and password are required'
        });
        return;
    }
    userName = req.body.userName;
    password = req.body.password;
    passwordHash = bcrypt.hashSync(password, 10);
    if (userNames.includes(userName)) {
        validPassword = await bcrypt.compare(password, passwords[userNames.indexOf(userName)]);
        if (validPassword) {
            displayName = userName;
            isLoggedIn = true;
            console.log('User logged in: ' + userName);
            res.status(200).json({
                status: 'success',
                message: 'User logged in successfully',
                displayName: displayName,
                isLoggedIn: isLoggedIn
            });
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Invalid password'
            });
        }
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid username'
        });
    }
});



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