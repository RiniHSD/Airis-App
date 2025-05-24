import express from 'express'
import { registerUser, loginUser, getUser, submitData } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/user/:userId', getUser);
router.post('/submit', submitData);

export default router