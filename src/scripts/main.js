import React from 'react';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import routes from './routes';

const history = createBrowserHistory();
const store = configureStore();
const container = document.querySelector('#container');

React.render(
    <Provider store={store}>
        {() =>
            <Router history={history}>
                {routes}
            </Router>
        }
    </Provider>,
    container
);
