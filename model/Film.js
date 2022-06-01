import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	backdrop_path: { type: String },
	budgets: { type: Number },
	genres: [{ type: String }],
	homepage: { type: String },
	id: { type: Number, required: true },
	languages: [{ type: String }],
	name: { type: String, required: true },
	origin_country: { type: Array },
	popularity: { type: Number },
	poster_path: { type: String },
	vote_average: { type: Number },
	vote_count: { type: Number },
	overview: { type: String },
});

export const Film = mongoose.model('films', schema);
