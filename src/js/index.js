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
const options = {
  root: null,
  rootMargin: '500px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(loadMoreNext, options);

formElement.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  event.preventDefault();
  observer.unobserve(loadMoreBtn);
  galleryElement.innerHTML = '';
  pixabayApi.q = event.currentTarget.elements['searchQuery'].value.trim();
  pixabayApi.page = 1;
  searchPhotos();
}

async function searchPhotos() {
  try {
    const { data } = await pixabayApi.searchPhotos();
    if (data.hits.length < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    observer.observe(loadMoreBtn);
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
    const result = pixabayApi.page * 40;
    const { data } = await pixabayApi.searchPhotos();
    galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    if (result >= data.totalHits) {
      observer.unobserve(loadMoreBtn);
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    simplelightbox.refresh();
  }  catch {
    error => {
      return Notify.failure(
        'Oops! Something went wrong! Try reloading the page or make another choice!'
      );
    };
  }   
}
