const showingResult = document.querySelector('.showing');
const filterDropdown = document.querySelector('#sortSelect');
const movieListEl = document.querySelector('.movies-grid')
const inputEl = document.querySelector('#searchInput');
const formEl = document.querySelector('#searchForm');


function onSearchChange(query) {
  showMovies(query);
}

filterDropdown.addEventListener('change', ele => {
  filterMovies(ele.target.value);
});

async function filterMovies(event) {
  let filter = event;
  
  const response = await fetch(`https://www.omdbapi.com/?apikey=df49e607&s=${inputEl.value}`);
  const data = await response.json();
  const movies = data.Search;

  if (filter === 'a-z') {
    movies.sort((a, b) => a.Title.localeCompare(b.Title))
  }
  else if (filter === 'z-a') {
    movies.sort((a, b) => b.Title.localeCompare(a.Title))
  }
  else if (filter === 'newest') {
    movies.sort((a, b) => Number(b.Year) - Number(a.Year))
  }
  else if (filter === 'oldest') {
    movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
  }

  movieListEl.innerHTML = movies.map(movie => updateMoviesHTML(movie)).join('');

  showingResult.innerHTML = inputEl.value;
}



async function showMovies(str) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=df49e607&s=${str}`);
  const data = await response.json();
  const movies = data.Search;

  movieListEl.innerHTML = movies.map(movie => updateMoviesHTML(movie)).join('');

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


showMovies('');