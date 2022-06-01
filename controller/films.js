import mongoose from 'mongoose';
import { Film } from '../model/Film.js';
import { User } from '../model/User.js';

export const addFilm = async (req, res) => {
	const query = req.query;
	const body = req.body;
	try {
		let film = await Film.findOneAndUpdate({ id: body.id }, { ...body });
		if (!film) {
			film = new Film({ ...body });
			await film.save();
		}

		if (query.type === 'like') {
			const user = await User.findOneAndUpdate(
				{ username: query.name },
				{ $push: { likes: film._id } },
				{ new: true }
			);
			const filmList = await User.findOne({
				username: query.name,
			}).populate('likes');
			res.status(200).json(filmList.likes);
		} else {
			console.log('first');
			const user = await User.findOneAndUpdate(
				{ username: query.name },
				{ $push: { favorites: film._id } },
				{ new: true }
			);
			console.log('second');
			const filmList = await User.findOne({
				username: query.name,
			}).populate('favorites');
			console.log('third');
			res.status(200).json(filmList.favorites);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const fetchLikesAndFavorites = async (req, res) => {
	const { name } = req.query;
	try {
		const filmList = await User.findOne({
			username: name,
		}).populate(['likes', 'favorites']);
		res.status(200).json({
			likes: filmList.likes,
			favorites: filmList.favorites,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteFilm = async (req, res) => {
	const { id } = req.params;
	const { name, type, variant } = req.query;

	try {
		console.log(id);
		const film = await Film.findOneAndDelete({ id });
		console.log(film);
		if (type === 'like') {
			await User.updateOne(
				{ username: name },
				{ $pullAll: { likes: [film._id] } }
			);
		} else {
			await User.updateOne(
				{ username: name },
				{ $pullAll: { favorites: [film._id] } }
			);
		}
		const filmList = await User.findOne({
			username: name,
		}).populate(['likes', 'favorites']);
		res.status(200).json({
			likes: filmList.likes,
			favorites: filmList.favorites,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
