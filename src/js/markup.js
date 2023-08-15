export function createMarkup(array) {
  return markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-cards">
          <div class="img-wrapper">
              <a class="gallery-link" href="${largeImageURL}">
                  <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
              </a>
          </div>
          <div class="info">
              <p class="info-item">
              <b>Likes</b>${likes}
              </p>
              <p class="info-item">
              <b>Views</b>${views}
              </p>
              <p class="info-item">
              <b>Comments</b>${comments}
              </p>
              <p class="info-item">
              <b>Downloads</b>${downloads}
              </p>
          </div>
          </div>`;
      }
    )
    .join('');
}
