const {createUser, validateUsernamePassword, getUserByEmail, generateToken, generateTokenForVerification, updatePassword, toggleVerification} = require('../services/user.service.js')
const {sendEmail} = require('../services/email.service');
const {emailSecret} = require('../config')

const signUp = async (req, res) => {
    
    const {name, email, password, confirmPassword, phoneNumber, dob} = req.body
    console.log('Initiating user creation')

    var condition = true;

    // Check if all fields are present
    if (!(name && email && password && phoneNumber && confirmPassword)) {
        res.status(400).json({msg: 'Insufficient information'});
        condition = false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        res.status(400).json({msg: 'Passwords do not match'});
        condition = false;
    }
    if (condition) {
        try {
            msg = await createUser({name, email, password, phoneNumber, dob});
            
            // await sendEmail({
            //     to: email,
            //     subject: 'Welcome to the e-commerce app',
            //     text: `Hi ${name},\n\nWelcome to the e-commerce app.\n\nPlease click on the following link to verify your account:\n\nhttp://localhost:3000/auth/signup/verify?token=${token}\n\nRegards,\n\nE-commerce team`,
            //     html: '<h1>Welcome</h1>'
            // })
            // res.status(201).json({msg: 'User created successfully', token: token});
            res.status(201).json({msg: msg})
            console.log("User created successfully.")
        } catch (error) {
            console.log(error.stack);
            res.status(500).json({msg: 'Something Failed'});
        }
    }
}

const login = async (req, res) => {
    const {email, password} = req.body
    if (!(email && password)){
        res.status(400).json({msg: 'Email or password missing'})
    } else {
        try{
            const response = await validateUsernamePassword(email, password)
            if (response && response.pass) {
                res.status(200).json({msg: 'SignIn successful.', token : response.token})
                console.log('SignIn successful for email', email)
            } else {
                res.status(401).json({msg: 'Invalid credentials.'})
                console.log('Invalid credentials')
            }
        } catch (error) {
            console.log(error.stack)
            res.status(500).json({msg: 'Something Failed'})
        }
    }
}

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    
    try{
        if (!email){
            res.status(400).json({msg: 'Email missing'});
        } else {
            const user = await getUserByEmail(email);
            if (!user){
                res.status(404).json({msg: 'User not found'});
            };
            const token = await generateToken(user.name, user.email, user.role, expiry='10m');
            await sendEmail({
                to: email,
                subject: 'Reset Password',
                text: `Hi ${user.name},\n\nPlease click on the following link to reset your password:\n\nhttp://localhost:3000/resetpassword?token=${token}\n\nRegards,\n\nCalorie Counter App`,
                html: '<h1>Reset Password</h1>'
            })
            res.status(200).json({msg: 'Token generated', token: token});
        }
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({msg: 'Something Failed'});
    }
};

const resetPassword = async (req, res) => {
    const {password, confirmPassword} = req.body;
    const {email} = req.userDetails;

    try {
        if (password !== confirmPassword) {
            res.status(400).json({msg: 'Passwords do not match'});
        } else {
        await updatePassword(email, password);
        res.status(200).json({msg: 'Password updated'});
        }
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({msg: 'Something Failed'});
    }
};

const verifyUser = async (req, res) => {
    const {email} = req.userDetails;
    const user = await getUserByEmail(email);
    if (emailSecret !== req.userDetails.emailSecret){
        res.status(400).json({msg: 'Invalid token'})
    } else {
        if (user.isVerified) {
            res.status(200).json({msg: 'User already verified'});
        } else {
            toggleVerification(email, false);
            res.status(200).json({msg: 'User verified'});
        }
    }
}

const sendTokenUserVerification = async (req, res) => {
    const {email} = req.body
    const user = await getUserByEmail(email)
    if (!user){
        res.status(400).json({msg: "User not found."})
    } else {
        const token = await generateTokenForVerification(user.name, user.email)
        await sendEmail({
            to: email,
            subject: 'Email Verification',
            text: `Hi ${user.name},\n\nPlease click on the following link to verify your email address:\n\nhttp://localhost:3000/user-verify?token=${token}\n\nRegards,\n\nCalorie Counter App`,
            html: '<h1>Email Verification</h1>'
        })
        res.status(200).json({msg: "Kindly open your mail to continue the verification process."})
    }
}



module.exports = {
    login,
    signUp,
    forgotPassword,
    resetPassword,
    verifyUser,
    sendTokenUserVerification,
}