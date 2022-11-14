import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const searchForm = document.querySelector('.search-form');
const submitBtn = document.querySelector("[type='submit']");
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const footer = document.querySelector('.footer');

const PIXABAY_URL = 'https://pixabay.com/api/';
const PIXABAY_API_KEY = '2208122-c38407f0c226da94dd817bfa0';
const DEBOUNCE_DELAY = 100;
let currentPage = 1;
const POST_PER_PAGE = 40;

searchForm.addEventListener(
  'input',
  debounce(event => {
    const searchValue = event.target.value;
    localStorage.setItem('search-term', searchValue.trim());
  }, DEBOUNCE_DELAY)
);

submitBtn.addEventListener('click', event => {
  event.preventDefault();
  const savedSearch = localStorage.getItem('search-term');
  if (savedSearch === null || savedSearch === '') {
    Notiflix.Notify.info('Please type something in the search input.');
    return;
  }
  currentPage = 1;
  fetchImages(savedSearch, currentPage);
});

const fetchImages = async (searchValue, currentPage) => {
  let galleryMarkup = '';
  let params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: POST_PER_PAGE,
  });

  try {
    const response = await axios.get(
      `${PIXABAY_URL}?${params}&page=${currentPage}`
    );
    // console.log('response: ', response);
    const imagesArray = response.data.hits;
    // console.log('imagesArray: ', imagesArray);
    if (searchValue === '') {
    }
    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }

    loadMoreBtn.style.display = 'block';
    footer.style.display = 'flex';

    galleryMarkup = imagesArray
      .map(image => {
        return `
        <div class="photo-card">
          <div class ="thumb">
            <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>
      `;
      })
      .join('');

    gallery.innerHTML = galleryMarkup;
  } catch (error) {
    console.error(error);
  }
};

const fetchNewImages = async (searchValue, currentPage) => {
  let galleryMarkup = '';
  let params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: POST_PER_PAGE,
  });

  try {
    const response = await axios.get(
      `${PIXABAY_URL}?${params}&page=${currentPage}`
    );
    // console.log('response: ', response);
    const imagesArray = response.data.hits;
    // console.log('imagesArray: ', imagesArray);
    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    galleryMarkup = imagesArray
      .map(image => {
        return `
        <div class="photo-card">
          <div class ="thumb">
            <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>
      `;
      })
      .join('');

    gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  } catch (error) {
    console.error(error);
  }
};

loadMoreBtn.addEventListener('click', async () => {
  const searchValue = localStorage.getItem('search-term');
  currentPage++;
  let params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: POST_PER_PAGE,
  });
  try {
    const response = await axios.get(
      `${PIXABAY_URL}?${params}&page=${currentPage}`
    );

    const imagesArray = response.data.hits;
    const imagesPerPage = POST_PER_PAGE;

    const totalImages = response.data.totalHits;
    const maxPageNumber = totalImages / imagesPerPage;
    const maxPageNumberRoundUp = Math.ceil(maxPageNumber);
    console.log('currentPage: ', currentPage);
    console.log('maxPageNumber: ', maxPageNumber);
    console.log('maxPageNumberRoundUp: ', maxPageNumberRoundUp);

    if (currentPage === maxPageNumberRoundUp) {
      footer.style.display = 'none';
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    fetchNewImages(searchValue, currentPage);
  } catch (error) {
    console.error(error);
  }
});
footer.style.display = 'none';
loadMoreBtn.style.display = 'none';
