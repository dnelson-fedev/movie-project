const showingResult = document.querySelector('.showing');
const filterDropdown = document.querySelector('#sortSelect');
const movieListEl = document.querySelector('#moviesGrid')
const inputEl = document.querySelector('#searchInput');
const formEl = document.querySelector('#searchForm');
let moviesList = [];

function onSearchChange(query) {
  showMovies(query);
}

filterDropdown.addEventListener('change', ele => {
  filterMovies(ele.target.value);
});

function showLoading(count = 10) {
  movieListEl.innerHTML = Array(count)
    .fill(
      `<div class="movie-card--skeleton">
          <img
            class="movie-card__img--skeleton"
            src=""
            alt=""
            onerror="this.style.visibility='hidden'"
          />
          <h2 class="movie-card__title--skeleton"></h2>
          <p class="movie-card__year--skeleton"></p> 
        </div>`
    ).join('');
}

async function filterMovies(event) {
  let filter = event;
  moviesSorted = [...moviesList]

  if (filter === 'a-z') {
    moviesSorted.sort((a, b) => a.Title.localeCompare(b.Title))
  }
  else if (filter === 'z-a') {
    moviesSorted.sort((a, b) => b.Title.localeCompare(a.Title))
  }
  else if (filter === 'newest') {
    moviesSorted.sort((a, b) => Number(b.Year) - Number(a.Year))
  }
  else if (filter === 'oldest') {
    moviesSorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
  }

  showLoading();

  movieListEl.innerHTML = moviesSorted.map(movie => updateMoviesHTML(movie)).join('');

  showingResult.innerHTML = inputEl.value;
}



async function showMovies(str) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=df49e607&s=${str}`);
  const data = await response.json();
  const movies = data.Search;
  moviesList = movies;

  if (!movies) {
    showLoading();
  }

  movieListEl.innerHTML = moviesList.map(movie => updateMoviesHTML(movie)).join('');

  showingResult.innerHTML = inputEl.value;
}

function updateMoviesHTML(movie) {
  return `<div class="movie-card">
            <img
              class="movie-card__img"
              src="${movie.Poster}"
              alt="${movie.Title} ${movie.Type}"
              onerror="this.outerHTML='<div class=\\'movie-card__poster-placeholder\\'>Movie Poster<br />Not Available</div>'"
            />
            <h2 class="movie-card__title">${movie.Title}</h2>
            <p class="movie-card__year">${movie.Year}</p>
        </div>`
}

inputEl.addEventListener('input', element => {
  showMovies(element.target.value);
});
formEl.addEventListener('submit', value => {
  value.preventDefault();
  onSearchChange(inputEl.value);
});


showMovies('Marvel');