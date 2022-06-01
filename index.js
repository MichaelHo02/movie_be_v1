import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import users from './routers/users.js';
import films from './routers/films.js';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.port || 5000;

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

app.use('/users', users);

app.use('/films', films);

app.get('/', (req, res) => {
	res.send('SUCCESS');
});

const URI = `mongodb+srv://ThachHo:ThachDeptrai@movie-epam.czueohg.mongodb.net/movie-epam-v1?retryWrites=true&w=majority`;
mongoose
	.connect(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to DB');
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('err', err);
	});
