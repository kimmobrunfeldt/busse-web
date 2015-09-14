import React from 'react';
import { connect } from 'react-redux';
import {RouteHandler} from 'react-router';

const App = React.createClass({
    // TODO: Add footer/header or remove
    render() {
        return <RouteHandler />;
    }
});

function mapStateToProps(state) {
    console.log(state)

    return state.toJS();
}

export default connect(mapStateToProps)(App);
