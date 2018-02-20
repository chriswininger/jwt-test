const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const jwt    = require('jsonwebtoken');
const fs = require('fs');

const secretString = fs.readFileSync('./chriswiningerAuth0.pem');
const port = 3003;

const app = express();
app.set('superSecret', secretString);

const apiRouter = express.Router();
const appRouter = express.Router();

appRouter.use('/', express.static(__dirname + '/public/'));
appRouter.use('/vendors', express.static(__dirname + '/node_modules/'));

apiRouter.use(bodyParser.json());
apiRouter.use(passport.initialize());
apiRouter.use((req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('superSecret'), (err, decoded) => {
			if (err) {
				res.json({
					status: 'fail',
					message: 'failed to authenticate token'
				});
			} else {
				// now we have decoded token for ref in future route handlers
				req.decoded = decoded;
				console.info('decoded token: ' +
					JSON.stringify(decoded, null, 4));
				next();
			}
		});	
	} else {
		res.status(403).json({
			status: 'fail',
			message: 'no token'
		});
	}
});

apiRouter.post('/test.json', (req, res) => {
	console.info('request received: ' + req.url);
	console.info('post body: ' + JSON.stringify(req.body, null, 4));
	res.status(200).json({ status: 'ok' });
});

app.use('/api', apiRouter);
app.use('/', appRouter);
app.listen(port, () => console.log('listening on port: ', port));

