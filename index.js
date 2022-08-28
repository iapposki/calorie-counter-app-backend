require('dotenv').config()
const express = require('express');
const {signUp, login, forgotPassword, resetPassword, sendTokenUserVerification, verifyUser, } = require('./controllers/user.controller')
const {addFoodEntry, getFoodEntries, updateFoodEntry, deleteFoodEntry, getCaloriesByDate, customEntryStats} = require('./controllers/food.controller')
const {authenticate} = require('./middleware/auth')
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
app.post('/verification', sendTokenUserVerification)
app.post('/user-verify', authenticate, verifyUser)
app.post('/forgotpassword', forgotPassword)
app.post('/resetpassword', authenticate, resetPassword)

// Food related
app.post('/add-food-entry', authenticate, addFoodEntry) 
app.post('/get-food-entries', authenticate, getFoodEntries)                 // ++admin
app.post('/update-food-entry', authenticate, updateFoodEntry)
app.post('/delete-food-entry', authenticate, deleteFoodEntry)               // admin
app.post('/get-calories-by-day-for-user',authenticate, getCaloriesByDate)
app.post('/get-entry-stats', authenticate, customEntryStats)  




app.listen(port, () =>{
    console.log(`Server is running on port ${port} `);
})
