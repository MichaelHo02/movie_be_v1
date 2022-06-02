import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'films' }],
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'films' }],
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

export const User = mongoose.model('users', schema);
