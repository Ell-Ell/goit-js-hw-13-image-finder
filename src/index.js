import imageCardTpl from './templates/image-card.hbs';
import './sass/main.scss';
import NewApiService from './js/apiService';
import LoadMoreButton from './js/load-more-btn';

// Плагин открытия модального окна (вовремя нажатия на картинку)
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

// Для ошибки
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreButton({
  hidden: true,
});

const newApiService = new NewApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.galleryContainer.addEventListener('click', onGallaryImageClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  clearContainer();
  e.preventDefault();

  newApiService.query = e.currentTarget.elements.query.value.trim();

  // Если ошибка
  if (newApiService.query.length === 0) {
    return onFetchError();
  }

  loadMoreBtn.disable();
  newApiService.resetPage();
  onLoadMore();
  newApiService.incrementPage();
}

function onLoadMore() {
  loadMoreBtn.disable();
  newApiService.fetchImages().then(data => {
    if (data.length === 0) {
      loadMoreBtn.hide();
      return onFetchError();
    }
    loadMoreBtn.enable();
    addImageMarkup(data);
    if (data.length < 12) {
      loadMoreBtn.hide();
    }
  });
}

function addImageMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
  refs.galleryContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function clearContainer() {
  refs.galleryContainer.innerHTML = '';
  loadMoreBtn.hide();
}
// add click
function onGallaryImageClick(e) {
  const largeImageInModal = basicLightbox.create(
    ` <img src="${e.target.dataset.source}" alt="${e.target.alt}">`,
  );
  console.log(e.target.dataset.source);
  if (e.target.nodeName === 'IMG') {
    largeImageInModal.show();
  }
}

function onFetchError() {
  error({
    text: 'Sorry, no images could be found for this request!',
    sticker: false,
    hide: true,
    delay: 2000,
  });
}
