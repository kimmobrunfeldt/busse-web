import Velocity from 'velocity-animate';
import * as utils from '../utils';

const infoButton = document.querySelector('#InfoButton');
const infoButtonInfo = document.querySelector('#InfoButton-info');
const infoButtonClose = document.querySelector('#InfoButton-close');

function createInfoPage(opts) {
    infoButton.addEventListener('click', () => {
        opts.togglePage();
        toggleInfoButton();
    });
}

function toggleInfoButton() {
    const isInfoHidden = utils.hasClass(infoButtonInfo, 'hidden');

    if (isInfoHidden) {
        Velocity.animate(infoButton, { top: '26px', rotateZ: '0deg' }, 100);
        utils.removeClass(infoButtonInfo, 'hidden');
        utils.addClass(infoButtonClose, 'hidden');
    } else {
        Velocity.animate(infoButton, { top: '10px', rotateZ: '45deg' }, 100);
        utils.addClass(infoButtonInfo, 'hidden');
        utils.removeClass(infoButtonClose, 'hidden');
    }
}

export default createInfoPage;
