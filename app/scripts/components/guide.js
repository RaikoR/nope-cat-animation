import $ from 'jquery';

export default class Guide {
  constructor() {
    this.guides = $('.guide-board');

    this.guides.on('click', 'button', this.showGuide.bind(this));
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
