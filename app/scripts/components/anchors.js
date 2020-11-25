import $ from 'jquery';

export default class Anchors {
    constructor() {
        this.element = $('.guide .anchors');
        this.input = this.element.find('input');
        this.setBtn = this.element.find('.js-set-point');
        this.addBtn = this.element.find('.js-add-point');
        this.pointBtn = this.element.find('.js-add-anchor');
        // array handling is simpler, albeit less readable
        this.point = [0, 0];

        this.setBtn.on('click', this.setAnchorPoint.bind(this));
        this.addBtn.on('click', this.addAnchorPoint.bind(this));
        this.pointBtn.on('click', this.addAnchorElement.bind(this));
    }

    // set base drawing point from given single value
    setAnchorPoint(event) {
        if (this.input.val()) {
            this.point = this.input.val().split(',').map((val) => parseFloat(val.trim()));
            this.input.val('');
        } else {
            this.point = [0, 0];
        }

        this.updateAnchorPoint();
    }

    // split given values to coordinates (sep: space)
    // split coordinates and add to draw point (sep: comma)
    addAnchorPoint(event) {
        const ac = this.input.val().split(' ');

        for (const coord of ac) {
            const coordVal = coord.split(',');

            this.point[0] += parseFloat(coordVal[0].trim());
            this.point[1] += parseFloat(coordVal[1].trim());
        }

        this.input.val('');
        this.updateAnchorPoint();
    }

    updateAnchorPoint() {
        this.element.find('.js-anchor-result').html(this.point[0] + ',' + this.point[1]);
    }

    addAnchorElement(event) {
        const svg = $('.board svg');
        const acTemplate = '<circle cx="' + this.point[0] + '" cy="' + this.point[1] + '" r="2" fill="red"/>';

        const svgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        svgCircle.setAttribute('cx', this.point[0]);
        svgCircle.setAttribute('cy', this.point[0]);
        svgCircle.setAttribute('r', '2');
        svgCircle.setAttribute('fill', 'red');

        this.element.find('.js-anchor-code').text(acTemplate);
        document.getElementById('animation-main').appendChild(svgCircle);
    }
}
