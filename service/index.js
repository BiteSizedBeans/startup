const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
var apiRouter = express.Router();
app.use('/api', apiRouter);

var response = {
    "status": "success",
    "message": "This is another example response\n"
}

apiRouter.get('/response', (req, res) => {
    console.log(response);
    res.send(response.message);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });