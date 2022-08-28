const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const getFoodEntriesByUserId = async (userId, role) => {
    try {
        if (role === 1){
            const foodItems = await prisma.foodEntries.findMany()
            if (!foodItems){
                throw "No food entries present in db"
            } else {
                return foodItems
            }
        } else if (role === 0){
        const foodItems = await prisma.foodEntries.findMany({
            where: {
                userId: parseInt(userId)
            }
        })
        if (!foodItems){
            throw "No food item by this id present"
        } else {
            return foodItems
        }}
        
    } catch (error) {
        console.log(error.stack)
    }
}

const updateFoodEntry_Admin = async (foodEntryId, updatedData) => {
    await prisma.foodEntries.update({
        where : {id: parseInt(foodEntryId)},
        data : {...updatedData}
    })
}

const updateFoodEntryForUser = async (user, foodName, calories, vegetarian, addedTime, eatenAt) => {
    try {
        const convertedEatenAt = new Date(eatenAt)
        // console.log(convertedEatenAt)
        await prisma.user.update({
            where: {
                id : user.id
            }, data : {
                foodList : {create : [
                    {
                        name : foodName, calories, vegetarian, addedAt:addedTime, eatenAt:convertedEatenAt
                    }
                ]}
            }
        })
    } catch (error) {
        console.log(error.stack)
        console.log("Error occured in creating food entry for user.")
    }
}


const deleteFoodEntry_Admin = async (foodEntryId) => {
    await prisma.foodEntries.delete({
        where : {id : foodEntryId}
    })
}

const customEntryStats_Admin = async (daySpan) => {
    var date = new Date()
    // console.log(date)
    date.setDate(date.getDate() - daySpan);
    // console.log(date)
    const lastWeekData = await prisma.foodEntries.findMany({
        where : {
            eatenAt : {
                gte : date
            }
        }
    }) 
    date.setDate(date.getDate() - daySpan);
    const lastLastWeekData = await prisma.foodEntries.findMany({
        where:{
            eatenAt : {
                gte : date
            }
        }
    })
    date.setDate(date.getDate() + 2*daySpan)
    return {"date": date, "daySpan" : daySpan, "lastWeekEntries":Object.keys(lastWeekData).length, "lastLastWeek Entries":Object.keys(lastLastWeekData).length - Object.keys(lastWeekData).length }
}

module.exports = {
    getFoodEntriesByUserId,
    updateFoodEntry_Admin,
    updateFoodEntryForUser,
    deleteFoodEntry_Admin,
    customEntryStats_Admin
}