import express from 'express';
import { getUsers, login, register } from '../controller/users.js';

const router = express.Router();
router.get('/', getUsers);
router.post('/register', register);
router.post('/login', login);

export default router;
