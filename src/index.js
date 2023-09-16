import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let searchTerm = '';
let page = 1;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  searchTerm = event.target.searchQuery.value;
  page = 1;
  gallery.innerHTML = '';
  fetchImages();
});

async function fetchImages() {
  try {
    const API_KEY = '39482556-d60da0ad7dc5ab6f886d79ae4';
    const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    displayImages(response.data.hits);
    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    loadMoreButton.style.display = 'block';
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong, please try again later.');
  }
}

function displayImages(images) {
  const imageCards = images.map(img => `
        <div class="photo-card">
            <a href="${img.largeImageURL}" target="_blank"><img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /></a>
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${img.likes}</p>
                <p class="info-item"><b>Views:</b> ${img.views}</p>
                <p class="info-item"><b>Comments:</b> ${img.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${img.downloads}</p>
            </div>
        </div>`);

  gallery.innerHTML += imageCards.join('');
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

loadMoreButton.addEventListener('click', () => {
  page++;
  fetchImages();
});