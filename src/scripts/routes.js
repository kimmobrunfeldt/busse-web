var React = require('react');
var {Route, IndexRoute} = require('react-router');
var App = require('./containers/App');
var MapPage = require('./containers/MapPage');

const routes = [
    <Route path="*" component={App}>
        <IndexRoute component={MapPage} />
    </Route>
];

export default routes;
