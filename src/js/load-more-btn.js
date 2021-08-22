export default class LoadMoreButton {
  constructor({ hidden = false }) {
    this.refs = this.getRefs();

    hidden && this.hide();
  }

  getRefs() {
    const refs = {
      button: document.querySelector('[data-action="load-more"]'),
      dots: document.querySelector('.dots'),
    };
    return refs;
  }

  enable() {
    this.refs.dots.classList.add('load-more');
    this.refs.button.classList.remove('load-more');
  }

  disable() {
    this.refs.dots.classList.remove('load-more');
  }

  hide() {
    this.refs.button.classList.add('load-more');
    this.refs.dots.classList.add('load-more');
  }
}
