const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient 
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const {authSecret, emailSecret} = require('../config')

const generateToken = async (name, email, role, expiry='1h') => {
    const token = jwt.sign({name, email, role}, authSecret, {expiresIn:expiry});
    return token
}

const generateTokenForVerification = async (name, email, expiry='1h') => {
    const token = jwt.sign({name, email, emailSecret}, authSecret, {expiresIn:expiry});
    return token
}

const createUser = async (userDetails) => {
    try {
        await prisma.user.create({data: {...userDetails, password: md5(userDetails.password), dob: new Date(userDetails.dob)}})
        return "User created successfully."
    } catch (error) {
        console.log(error.stack)
        return "Error happened in user creation"
    }

}

const validateUsernamePassword = async (email, password) => {
    const user = await prisma.user.findFirst({where: {email : email,}})
    if (user) {
        const token = await generateToken(user.name, user.email, user.role)
        return {pass : user.password === md5(password), token : token}
    }
    return false
}

const getUserByEmail = async (email) => {
    if (!email){
        return 
    }
    const record = await prisma.user.findFirst({where: {email : email,}})
    return record;
};

const updatePassword = async (email, password) => {
    await prisma.user.update({
        where: {email: email},
        data: {password: md5(password)}
    })
}

const toggleVerification = async (email, isVerified) => {
    await prisma.user.update({
        where: {email: email},
        data: {isVerified: !isVerified}
    })
}
 



module.exports = {
    createUser,
    validateUsernamePassword,
    getUserByEmail,
    generateToken,
    updatePassword,
    toggleVerification,
    generateTokenForVerification

}