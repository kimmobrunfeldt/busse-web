if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

import path from 'path';
import http from 'http';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';

var SERVE_ROOT = './src/'
process.env.PORT = process.env.PORT || 7000;

const app = express();

// Heroku's load balancer can be trusted
app.enable('trust proxy');
app.disable('x-powered-by');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Dev and test
if (process.env.NODE_ENV !== 'production') {
    // Disable caching for easier testing
    app.use(function noCache(req, res, next) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
        next();
    });
}

app.use(compression({
    // Compress everything over 10 bytes
    threshold: 10
}));

app.use('/', express.static(SERVE_ROOT));
app.use('/*', express.static(SERVE_ROOT));

app.use(function errorLogger(err, req, res, next) {
    const status = err.status ? err.status : 500;

    if (status >= 400) {
        console.error('Request headers:');
        console.error(JSON.stringify(req.headers));
        console.error('Request parameters:');
        console.error(JSON.stringify(req.params));
    }

    if (process.env.NODE_ENV === 'test' && status >= 500 ||
        process.env.NODE_ENV === 'development'
    ) {
        console.log(err.stack);
    }

    next(err);
});

app.use(function errorResponder(err, req, res, next) {
    const status = err.status ? err.status : 500;
    const httpMessage = http.STATUS_CODES[status];

    let message;
    if (status < 500) {
        message = httpMessage + ': ' + err.message;
    } else {
        message = httpMessage;
    }

    let response = {message: message};
    if (err.data) {
        response.errors = err.data;
    }

    res.status(status);
    res.send(response);
});

let server = app.listen(process.env.PORT, () => {
    console.log(
        'Express server listening on http://localhost:%d in %s mode',
        process.env.PORT,
        app.get('env')
    );

    console.log('Files are served from:', path.join(__dirname, SERVE_ROOT));
});

function _closeServer(signal) {
    console.log(signal + ' received');
    console.log('Closing http.Server ..');
    server.close();
}

// Handle signals gracefully. Heroku will send SIGTERM before idle.
process.on('SIGTERM', _closeServer.bind(this, 'SIGTERM'));
process.on('SIGINT', _closeServer.bind(this, 'SIGINT(Ctrl-C)'));

server.on('close', () => {
    console.log('Server closed');
    process.emit('cleanup');
});
