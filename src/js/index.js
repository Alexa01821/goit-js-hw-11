import { PixabayApi } from './pixabay-api';
import { createMarkup } from './markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formElement = document.querySelector('#search-form');
const galleryElement = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const pixabayApi = new PixabayApi();
const simplelightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const target = document.querySelector('.js-guard');
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(loadMoreNext, options);

formElement.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  event.preventDefault();
  observer.unobserve(target);
  galleryElement.innerHTML = '';
  pixabayApi.q = event.currentTarget.elements['searchQuery'].value.trim();
  pixabayApi.page = 1;
  searchPhotos();
}

async function searchPhotos() {
  try {
    const { data } = await pixabayApi.searchPhotos();
    if (data.hits === '') {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    observer.observe(target);
    simplelightbox.refresh();
  } catch {
    Notify.failure(
      'Oops! Something went wrong! Try reloading the page or make another choice!'
    );
  }
}

function loadMoreNext(event) {
  pixabayApi.page += 1;
  if (event[0].isIntersecting) {
    searchMorePhotos();
  }
}

async function searchMorePhotos() {
  try {
    const result = pixabayApi.page * pixabayApi.per_page;
    const { data } = await pixabayApi.searchPhotos();
    galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    if (result >= data.totalHits) {
      observer.unobserve(target);
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    simplelightbox.refresh();
  } catch {
    return Notify.failure(
      'Oops! Something went wrong! Try reloading the page or make another choice!'
    );
  }
}
