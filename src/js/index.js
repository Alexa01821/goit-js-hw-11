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
let observer = new IntersectionObserver(scrollLoadMore, options);

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

function scrollLoadMore(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pixabayApiInstance.page += 1;

      const response = await pixabayApiInstance.fetchHits();
      const arrayImages = response.data.hits;

      refs.divGalleryContainer.insertAdjacentHTML(
        'beforeend',
        createMarkup(arrayImages)
      );
      lightbox.refresh();

      if (arrayImages <= PER_PAGE * pixabayApiInstance.page) {
        Notiflix.Notify.failure(
          'We`re sorry, but you`ve reached the end of search results.'
        );
        observer.unobserve(target);
      }
    }
  });
}
