import axios from 'axios';

export class PixabayApi {
  #BAZE_URL = 'https://pixabay.com/api/';
  #API_KEY = '38835015-a98c1366e41769307a118c04b';
  q = null;
  page = 1;
  async searchPhotos() {
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });
    return await axios.get(`${this.#BAZE_URL}?${searchParams}`);
  }
}
