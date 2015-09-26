import React from 'react';
import _ from 'lodash';

// Generic app loader, supports optional wait parameter
// `wait` is the time to wait in ms before the loader is rendered
// it can be used to show the loade after a timeout instead if immediately
const Loader = React.createClass({
    getDefaultProps() {
        return {
            wait: false
        };
    },

    getInitialState() {
        const showLoader = this._shouldWait(this.props) ? false : true;
        return {
            showLoader: showLoader,
            timer: null
        }
    },

    componentDidMount() {
        if (this._shouldWait(this.props)) {
            this.state.timer = setTimeout(this._showLoader, this.props.wait);
        }
    },

    componentWillUnmount() {
        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }
    },

    render() {
        if (!this.state.showLoader) {
            return null;
        }

        return <img
            src="/images/loader.svg"
            alt="Loading.."
            className="Loader" />;
    },

    _shouldWait(props) {
        return _.isNumber(props.wait);
    }
});

export default Loader;
