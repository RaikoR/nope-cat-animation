import $ from 'jquery';
import Overlay from '~/components/overlay';
import Anchors from '~/components/anchors';

export default class Guide {
    constructor() {
        this.guides = $('.guide-board');

        this.guides.on('click', '.guide-button', this.showGuide.bind(this));

        this.overlay = new Overlay();
        this.anchors = new Anchors();
    }

    showGuide(event) {
        const guide = $(event.currentTarget);

        if (guide.parent().hasClass('active')) {
            this.guides.removeClass('active');
        } else {
            this.guides.removeClass('active');
            guide.parent().addClass('active');
        }
    }
}
