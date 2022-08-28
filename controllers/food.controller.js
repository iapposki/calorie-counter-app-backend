const {getUserByEmail} = require('../services/user.service')
const {getFoodEntriesByUserId, updateFoodEntry_Admin, updateFoodEntryForUser, deleteFoodEntry_Admin, customEntryStats_Admin} = require('../services/food.service');
const { prisma } = require('@prisma/client');

const addFoodEntry = async (req, res) => {
    const {foodName, calories, vegetarian, eatenAt} = req.body;
    const {email} = req.userDetails
    console.log('Adding food entry for the given user')
    var addedTime = new Date()
    const user = await getUserByEmail(email)
    // console.log(user)
    try {
        await updateFoodEntryForUser(user, foodName, calories, vegetarian, addedTime, eatenAt)
        res.status(200).send({msg : "Added food to user."})
    } catch (error) {
        console.log(error.stack)
        res.status(500).send({msg : "Error occured while adding food entry for user."})
    }
}

const getFoodEntries = async (req,res) => {
    const {email, role} = req.userDetails
    if (role === 1){
        console.log("Getting all food entries.")
        const user = await getUserByEmail(email)
        // console.log(user)
        try {
            const response = await getFoodEntriesByUserId(user.id, user.role)
            res.status(200).json({msg : "Success", data : response})
        } catch (error){
            console.log(error) 
            res.status(500).json({msg: "Error while getting food entries in db."})
        }
    } else if (role === 0){
        const user = await getUserByEmail(email)
        // console.log(user)
        try {
            const response = await getFoodEntriesByUserId(user.id, user.role)
            res.status(200).json({msg : "Success", data : response})
        } catch (error){
            console.log(error) 
            res.status(500).json({msg: "Error while getting food entries for the user"})
        }
    } else {
        console.log("Role problem : ", email)
    }
}

const updateFoodEntry = async (req, res) => {
    const {role} = req.userDetails;
    if (role === 1) {
        try {
            const {foodEntryId, updatedData} = req.body
            await updateFoodEntry_Admin(foodEntryId, updatedData)
            res.status(200).json({msg: "Update successful."})
        } catch (error) {
            console.log(error.stack)
            res.status(400).json({msg: "Error while updating food entry."})
        }
    } else if (role === 0) {
        console.log("Unauthorized food entry update attempted.")
        res.status(200).json({msg: "Access denied."})
    }
}

const deleteFoodEntry = async (req, res) => {
    const {role} = req.userDetails;
    if (role === 1) {
        try {
            const {foodEntryId} = req.body
            await deleteFoodEntry_Admin(foodEntryId)
            res.status(200).json({msg: "Delete successful."})
        } catch (error) {
            console.log(error.stack)
            res.status(400).json({msg: "Error while deleting food entry."})
        }
    } else if (role === 0) {
        console.log("Unauthorized food entry delete attempted.")
        res.status(200).json({msg: "Access denied."})
    }
}

const getCaloriesByDate = async (req,res) => {
    // gets days when calories for the day were over limit
    const {userId} = req.body
    const {email} = req.userDetails
    const user = await getUserByEmail(email)
    const userFoodItems = await getFoodEntriesByUserId(userId,1)
    const dayData = {}
    userFoodItems.forEach(entry => {
        var date = new Date(entry.eatenAt)
        var fullDate = String(date.getDate()) + "/" +String(date.getMonth()) + "/" + String(date.getFullYear())
        if (typeof(dayData[fullDate]) === typeof(entry.calories)) {
            dayData[fullDate] = dayData[fullDate] + entry.calories
        } else {
            dayData[fullDate] = entry.calories
        }
        // console.log(dayData[fullDate])
    })
    const finalDayData = {}
    for (var key in dayData){
        if (dayData[key] > user.dailyCalorieLimit) {
            finalDayData[key] = dayData[key]
        }
    }
    // console.log(userFoodItems)
    res.status(200).json({msg: "Successful", data: finalDayData})
}

const customEntryStats = async (req, res) => {
    const {role} = req.userDetails
    const {daySpan} = req.body
    if (role === 1) {
        try {
            const response = await customEntryStats_Admin(daySpan)
            res.status(200).json({msg:response})
        } catch (error) {
            console.log(error.stack)
            res.status(500).json({msg : "Server error while getting custom entry stats."})
        }
        
    } else if (role === 0) {
        res.status(400).json({msg : "Unauthorized request."})
    }
}

module.exports = {
    addFoodEntry,
    getFoodEntries,
    updateFoodEntry,
    deleteFoodEntry,
    getCaloriesByDate,
    customEntryStats
}