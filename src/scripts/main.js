import React from 'react';
var Router = require('react-router')
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import routes from './routes';

const store = configureStore();
const container = document.querySelector('#container');

Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(
        <Provider store={store}>
            { () => <Root /> }
        </Provider>,
        container
    );
});
