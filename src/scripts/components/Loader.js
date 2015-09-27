import * as utils from '../utils';

function createLoader(selector) {
    const element = document.querySelector(selector);

    function show() {
        utils.removeClass(element, 'hidden');
    }

    function hide() {
        utils.addClass(element, 'hidden');
    }

    return {
        show,
        hide
    };
}

export default createLoader;
