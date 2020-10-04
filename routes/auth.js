require('dotenv').config()
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
router.use(cors())

router.get('/', auth, async (req, res) => {
    try {
        const user = await (await User.findById(req.user.id)).isSelected("-password")
        res.json(user)

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')

    }
})


// @route   POST auth/register
// @desc    Register User / Returning JWT Token
// @access  Public

router.post('/register',[
    check ('name','Please provide a name').not().isEmpty(),
    check('email','Please provide an email').isEmail(),
    check('role','Please provide a role').not().isEmpty(),
    check('password', 'password is required')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
    .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

],
async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,role,password}=req.body
    try{
        let user=await User.findOne({email})
        if(user){
            return res.status(400).json({errors:[{msg:'User already exists'}]})
        }
        user=new User({
            name,
            email,
            role,
            password
        })
        const salt=await bcrypt.genSalt(10)
        user.password=await bcrypt.hash(password,salt)
        await user.save()
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:36000
        },
        (err,token)=>{
            if(err) throw err
            res.json({token}
                )
        }
        )
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({errors:[{ msg: 'Server Error' }]})
}
})

// @route   POST auth/login
// @desc    Login User / Returning JWT Token
// @access  Public

router.post('/login',
    [
    check('email', 'Please provide an email').isEmail(),
    check('password', 'Password is required').exists().not().isEmpty(),
    check('role', 'Role is required').exists().not().isEmpty(),
    ],
    
    
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { email, password, role } = req.body
        try {
            let user = await User.findOne({ email, role })
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'User not found' }] })
            }
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                return res.status(400).json({errors:[{ msg: 'Invalid Credentials' }]})
            }
            const payload = {
                user: {
                    id: user.id,
                    role:user.role
                }
            }
            jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: 36000
            },
                (err, token) => {
                    if (err) throw err
                   return  res.json({ token,role:user.role })
                }
            )
        }
        catch (err) {
            console.error(err.message)
            res.status(500).json({errors:[{ msg: 'Server Error' }]})

        }
    }

)
module.exports = router
