import React from 'react';
import {connect} from 'react-redux';
import Loader from '../components/Loader';

const App = React.createClass({
    render() {
        // Show loader if requests are taking way too long
        const maybeLoader = this.props.loading
            ? <Loader wait={5000} />
            : null;

        return <div className="App">
            {maybeLoader}
            {this.props.children}
        </div>;
    },

});

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(App);
