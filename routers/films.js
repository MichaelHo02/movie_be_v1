import express from 'express';
import {
	addFilm,
	fetchLikesAndFavorites,
	deleteFilm,
} from '../controller/films.js';

const router = express.Router();
router.post('/', addFilm);
router.get('/', fetchLikesAndFavorites);
router.delete('/:id', deleteFilm);

export default router;
