const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const getFoodById = async (foodID) => {
    try {
        const foodItem = await prisma.foodCatalogue.findUnique({
            where: {
                id: parseInt(foodID)
            }
        })
        if (!foodItem){
            throw "No food item by this id present"
        } else {
            return foodItem
        }
    } catch (error) {
        console.log(error.stack)
    }
}

module.exports = {
    getFoodById
}