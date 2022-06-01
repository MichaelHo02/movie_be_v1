import argon2 from 'argon2';
import { User } from '../model/User.js';

export const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
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

// export const updateUser = async (req, res) => {
// 	try {
// 		const updateUser = req.body;

// 		const user = await User.findOneAndUpdate(
// 			{ _id: updateUser._id },
// 			updateUser,
// 			{ new: true }
// 		);
// 		res.status(200).json(user);
// 	} catch (err) {
// 		res.status(500).json({ err: err });
// 	}
// };
