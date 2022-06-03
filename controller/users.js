import argon2 from 'argon2';
import { User } from '../model/User.js';

export const getUsers = async (req, res) => {
	const { username, name } = req.query;
	try {
		const users = await User.find({
			username: { $regex: username, $options: 'i' },
		}).select('username likes favorites');

		const user = await User.findOne({
			username: name,
		}).populate(['friends']);
		res.status(200).json({ users, friends: user.friends });
	} catch (err) {
		res.status(500).json({ err: err });
	}
};

export const register = async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return res.status(200).json({
			success: false,
			message: 'Missing username/email/password',
		});
	}

	try {
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(200)
				.json({ success: false, message: 'Email already registered' });
		}
		user = await User.findOne({ username });
		if (user) {
			return res.status(200).json({
				success: false,
				message: 'Username already registered',
			});
		}

		const hashedPassword = await argon2.hash(password);
		const newUser = new User({ username, email, password: hashedPassword });

		await newUser.save();
		res.status(200).json({
			success: true,
			message: 'User saved successfully',
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const login = async (req, res) => {
	console.log('hello');
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(200).json({
			response: {
				success: false,
				message: 'Missing email/password',
			},
		});
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(200).json({
				response: {
					success: false,
					message: 'Incorrect email or password',
				},
			});
		}

		const passwordValid = await argon2.verify(user.password, password);
		if (!passwordValid) {
			return res.status(200).json({
				response: {
					success: false,
					message: 'Incorrect email or password',
				},
			});
		}

		res.status(200).json({
			response: {
				success: true,
				message: 'User login successfully',
			},
			data: {
				username: user.username,
				email: user.email,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			response: {
				success: false,
				message: 'Internal server error',
			},
		});
	}
};

export const addFriend = async (req, res) => {
	const { me, friend } = req.body;
	try {
		const meId = await User.findOne({ username: me });
		const friendId = await User.findOne({ username: friend });
		await User.findOneAndUpdate(
			{ username: me },
			{ $push: { friends: friendId._id } },
			{ new: true }
		);
		await User.findOneAndUpdate(
			{ username: friend },
			{ $push: { friends: meId._id } }
		);
		const user = await User.findOne({
			username: me,
		}).populate(['friends']);
		res.status(200).json(user.friends);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const removeFriend = async (req, res) => {
	const { me, friend } = req.body;
	try {
		const meId = await User.findOne({ username: me });
		const friendId = await User.findOne({ username: friend });
		await User.findOneAndUpdate(
			{ username: me },
			{ $pullAll: { friends: [friendId._id] } },
			{ new: true }
		);
		await User.findOneAndUpdate(
			{ username: friend },
			{ $pullAll: { friends: [meId._id] } }
		);
		const user = await User.findOne({
			username: me,
		}).populate(['friends']);
		res.status(200).json(user.friends);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
