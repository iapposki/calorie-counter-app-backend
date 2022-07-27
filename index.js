require('dotenv').config()
const express = require('express');
const {signUp, login} = require('./controllers/user.controller')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors());

app.get('/status', (req, res) => {
    res.status(200).send("Node server is running.")
})

// User related
app.post('/signup', signUp) 
app.post('/login', login)

app.listen(port, () =>{
    console.log(`Server is running on port ${port} `);
})
