const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const addFood = async (name, calories, vegetarian) => {
    try {
        await prisma.foodCatalogue.create({
            data:{
                name,
                calories,
                vegetarian
            }
        })
    } catch(error){
        console.log(error.stack)
    }}

const deleteFoodById = async(id) => {
    try {
        await prisma.foodCatalogue.delete({
            where:{
                id : id
            }
        })
    } catch (error){
        console.log(error.stack)
    }
}

addFood("Cheese Burger", 500, true)