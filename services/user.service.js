const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient 
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const {authSecret} = require('../config')

const createUser = async (userDetails) => {
    try {
        await prisma.user.create({data: {...userDetails, password: md5(userDetails.password), dob: new Date(userDetails.dob)}})
        return "User created successfully."
    } catch (error) {
        console.log(error.stack)
        return "Error happened in user creation"
    }

}




module.exports = {
    createUser,
}