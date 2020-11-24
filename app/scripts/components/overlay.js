import $ from 'jquery';

export default class Overlay {
    constructor() {
        this.element = $('.guide-item.overlay');
        this.overlayGuide = this.element.find('.guide__overlay');
        this.overlayImage = this.element.find('> svg');
        this.zoomBox = this.element.find('.guide__zoombox');
        this.gridBtn = this.element.find('.guide-grid-button');

        this.showZoom = false;
        this.zoomSizes = [2, 5, 10];
        this.zoomSize = 0;

        this.gridBtn.on('click', this.showGuideGrid.bind(this));
        $(window).on('resize', this.setZoomSize.bind(this));
        this.element.on('mousemove', this.moveGuide.bind(this));

        // waits for a frame draw so SVG's size can be correctly determined
        setTimeout(() => {
            $(window).trigger('resize');
        }, 17);
    }

    showGuideGrid(event) {
        const btn = $(event.currentTarget);
        const gridType = btn.data('grid');

        switch (gridType) {
            case 'normal':
                this.overlayGuide.toggleClass('has-grid');
                this.zoomBox.toggleClass('has-grid');
                btn.toggleClass('is-active');
                break;
            case 'hd':
                this.overlayGuide.toggleClass('has-hd-grid');
                this.zoomBox.toggleClass('has-hd-grid');
                btn.toggleClass('is-active');
                break;
            case 'zoom':
                this.toggleZoom(btn);
                break;
        }
    }

    toggleZoom(btn) {
        if (this.showZoom) {
            // toggle active zoom
            this.zoomSize++;
        }

        if (this.zoomSize >= this.zoomSizes.length) {
            this.showZoom = false;
            this.zoomSize = 0;
        } else {
            this.showZoom = true;
        }

        if (this.showZoom) {
            this.element.addClass('show-zoom');
            btn.addClass('is-active');
            btn.find('.size').text('x' + this.zoomSizes[this.zoomSize]);
            this.setZoomSize();
        } else {
            this.element.removeClass('show-zoom');
            btn.removeClass('is-active');
            btn.find('.size').text('');
        }
    }

    setZoomSize(event) {
        this.zoomBox.css({ 'background-size': (this.overlayImage.innerWidth() * this.zoomSizes[this.zoomSize]) + 'px ' + (this.overlayImage.innerHeight() * this.zoomSizes[this.zoomSize]) + 'px' });
    }

    moveGuide(event) {
        if (!this.showZoom) {
            return;
        }

        const padding = 10;
        const boxSize = 200;

        let posX = event.offsetX + padding;
        let posY = event.offsetY;
        const bgPosX = (posX * -1 + padding) * this.zoomSizes[this.zoomSize] + boxSize / 2;
        const bgPosy = posY * -1 * this.zoomSizes[this.zoomSize] + boxSize / 2;

        if (posX + boxSize > this.overlayGuide.innerWidth()) {
            posX = event.offsetX - padding - boxSize;
        }

        if (posY + boxSize > this.overlayGuide.innerHeight()) {
            posY = event.offsetY - boxSize;
        }

        this.zoomBox.css({
            'background-position-x': bgPosX,
            'background-position-y': bgPosy,
            'left': posX,
            'top': Math.max(68, posY + 48),
        });
    }
}
