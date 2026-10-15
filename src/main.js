import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const formEl = document.querySelector('.form');
const searchButton = formEl.querySelector('button');
const loadMoreButton = document.querySelector('.load-more');

let query = '';
let page = 1;
let loadedImages = 0;
let totalHits = 0;
let isLoading = false;

formEl.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();
  if (isLoading) return;

  const searchText = formEl.elements['search-text'].value.trim();

  if (searchText === '') {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  query = searchText;
  page = 1;
  loadedImages = 0;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton();
  isLoading = true;
  searchButton.disabled = true;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    loadedImages = data.hits.length;
    totalHits = data.totalHits;
    updateLoadMoreButton();
  } catch {
    iziToast.error({
      message: 'Could not load images. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    searchButton.disabled = false;
    isLoading = false;
  }
}

async function onLoadMore() {
  if (isLoading || loadedImages >= totalHits) return;

  isLoading = true;
  searchButton.disabled = true;
  hideLoadMoreButton();
  showLoader();

  try {
    const nextPage = page + 1;
    const data = await getImagesByQuery(query, nextPage);
    page = nextPage;

    if (data.hits.length === 0) {
      notifyEndOfResults();
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;
    totalHits = data.totalHits;
    updateLoadMoreButton();

    const { height } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();

    window.scrollBy({ top: height * 2, behavior: 'smooth' });
  } catch {
    showLoadMoreButton();
    iziToast.error({
      message: 'Could not load more images. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    searchButton.disabled = false;
    isLoading = false;
  }
}

function updateLoadMoreButton() {
  if (loadedImages >= totalHits) {
    hideLoadMoreButton();
    notifyEndOfResults();
    return;
  }

  showLoadMoreButton();
}

function notifyEndOfResults() {
  iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
    position: 'topRight',
  });
}
