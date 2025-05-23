import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
import { registerUser, loginUser, getUser } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/user/:userId', getUser);

export default router