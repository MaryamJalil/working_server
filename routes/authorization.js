const express = require('express')
const router = express.Router()
const cors = require('cors')

const auth = require('../middleware/auth')
const User = require('../models/User')

router.use(cors())

// @route   GET api/authorization
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        
            const user = await User.findById(req.user.id).select('-password');
            return res.json(user)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});
module.exports = router