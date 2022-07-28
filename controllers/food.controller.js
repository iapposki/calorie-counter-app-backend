const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const {getUserByEmail} = require('../services/user.service')
const {getFoodById} = require('../services/foodCatalogue.service')

const addFoodEntry = async (req, res) => {
    const {foodID} = req.body;
    const {email} = req.userDetails
    console.log('Adding food entry for the given usrer email')
    const addedFood = await getFoodById(foodID)

    const {calories, vegetarian} = addedFood;
    const foodName = addedFood.name
    var d = new Date()
    console.log(d)
    const user = await getUserByEmail(email)
    console.log(user)
    await prisma.user.update({
        where: {
            id : user.id
        }, data : {
            foodList : {create : [
                {
                    name : foodName, calories, vegetarian, addedAt:d
                }
            ]}
        }
    })
    res.status(200).send({msg : "Added food to user."})
}

module.exports = {
    addFoodEntry,
    
}