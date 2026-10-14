import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function createCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <ul class="info">
        <li class="info-item"><b>Likes</b><span>${likes}</span></li>
        <li class="info-item"><b>Views</b><span>${views}</span></li>
        <li class="info-item"><b>Comments</b><span>${comments}</span></li>
        <li class="info-item"><b>Downloads</b><span>${downloads}</span></li>
      </ul>
    </li>`;
}

export function createGallery(images) {
  const markup = images.map(createCardMarkup).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  loaderEl.classList.remove('is-hidden');
}

export function hideLoader() {
  loaderEl.classList.add('is-hidden');
}
