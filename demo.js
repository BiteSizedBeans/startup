const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

const passwords = {};
const token = uuid.v4();

app.post('/register', async (req, res) => {
 const hashedPassword = await bcrypt.hash(req.body.password, 10);
 passwords[req.body.user] = hashedPassword;
 res.send({ user: req.body.user });
});

app.put('/login', async (req, res) => {
 const hashedPassword = passwords[req.body.user];
 if (hashedPassword && (await bcrypt.compare(req.body.password, hashedPassword))) {
   res.send({ user: req.body.user });
 } else {
   res.send(401, { msg: 'invalid user or password' });
 }
});

app.listen(3000);
