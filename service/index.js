const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.use(express.json());

var apiRouter = express.Router();
app.use('/api', apiRouter);

var displayName = '';
var isLoggedIn = false;

apiRouter.post('/signup', (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).send('Username and password are required');
        return;
    }
    userName = req.body.userName;
    password = req.body.password;
    displayName = userName;
    isLoggedIn = true;

    console.log('New user signup: ' + userName + ' ' + password);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        displayName: displayName,
        isLoggedIn: isLoggedIn
    });
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