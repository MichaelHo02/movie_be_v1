import express from 'express';
import {
	addFriend,
	getUsers,
	login,
	register,
	removeFriend,
} from '../controller/users.js';

const router = express.Router();
router.get('/', getUsers);
router.post('/register', register);
router.post('/login', login);
router.post('/friends', addFriend);
router.put('/friends', removeFriend);

export default router;
