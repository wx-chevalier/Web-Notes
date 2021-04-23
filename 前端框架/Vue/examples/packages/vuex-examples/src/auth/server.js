const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

const MONGO_URI =
	process.env.NODE_ENV === 'development'
		? 'mongodb://localhost:27017/auth'
		: 'mongodb://heroku_x4xnglm7:em5c6br38p6molbe25j3qfqod6@ds011880.mlab.com:11880/heroku_x4xnglm7';

mongoose.connect(MONGO_URI);

if (process.env.NODE_ENV === 'development') {
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const config = require('./webpack.config');
	const compiler = webpack(config);

	app.use(
		webpackDevMiddleware(compiler, {
			noInfo: true,
			publicPath: config.output.publicPath,
			writeToDisk: filePath => {
				return /.*\.html$/.test(filePath);
			}
		})
	);
}

app.use(bodyParser.json());

const Auth = require('./controllers/auth');
require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

app.post('/auth/signin', requireSignin, Auth.signin);
app.post('/auth/signup', Auth.signup);
app.get('/auth/verify', requireAuth);

app.use('/dist', express.static(process.cwd() + '/dist'));

app.use((req, res) => res.sendFile(__dirname + '/dist/index.html'));

app.listen(3000, () => console.log('Server Listening on PORT 3000'));
