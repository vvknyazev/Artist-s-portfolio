const {Router} = require('express');
const controller = require('../controllers/authController');
const {check} = require('express-validator');
const authorization = require('../middleware/authorization');
const {requireAuth, checkUser, checkAdmin} = require("../middleware/authorization");
 // const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.get('/registration', controller.getRegistration);
router.get('/login', controller.getLogin);


router.post('/registration',[
    check('username', 'Username is empty').notEmpty(),
    check('password', 'Password must be more than 5 characters and less than 20').isLength({min: 5, max: 20})
] ,controller.registration);
router.post('/login', checkUser,controller.login);
router.get('/users', checkAdmin, controller.getUsers);
router.get('/logout', controller.logout);


// router.get("/logout", authorization, (req, res) => {
//     return res
//         .clearCookie("access_token")
//         .status(200)
//         .json({ message: "Successfully logged out 😏 🍀" });
// });

module.exports = router;