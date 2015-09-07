var React = require('react');
var {Route, DefaultRoute, NotFoundRoute} = require('react-router');
var App = require('./App.js');
var IndexPage = require('./pages/IndexPage.js');

// TODO: add all routes
const routes = (
    <Route path="/" handler={App}>
        <Route name="info" path="info/?" handler={IndexPage} />
        <DefaultRoute name="index" handler={IndexPage} />
        <NotFoundRoute handler={IndexPage} />
    </Route>
);

export default routes;
