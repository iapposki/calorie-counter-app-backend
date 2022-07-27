const {createUser, validateUsernamePassword} = require('../services/user.service.js')


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
                res.status(200).json({msg: 'SignIn successful.'})
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


module.exports = {
    signUp,
    login,
}