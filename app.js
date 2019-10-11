const http = new simpleHTTP();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    searchMovieInput: 'search-movie-input',
    addMovieBtn: 'add-movie-btn',
    movieTableBody: 'movie-tabe-body',
    activeMovieDetails: 'active-movie-details',
    posterContainer: 'poster-container'
  };

  function displayActiveMovie(movie) {
    const activeMovieDetails = document.getElementById(
      UISelectors.activeMovieDetails
    );
    const activePosterContainer = document.getElementById(
      UISelectors.posterContainer
    );

    const addMovieBtn = document.getElementById(UISelectors.addMovieBtn);
    movie.poster;
    if (movie.Poster && movie.Poster !== 'N/A') {
      activePosterContainer.innerHTML = '<img src=' + movie.Poster + '/>';
    } else {
      activePosterContainer.innerHTML = '';
    }

    if (movie.Response === 'False') {
      activeMovieDetails.innerHTML = '<p>No movie found...</p>';
      addMovieBtn.style.display = 'none';
    } else {
      activeMovieDetails.innerHTML =
        '<h4>' +
        movie.Title +
        '</h4>' +
        '<p>' +
        movie.Plot +
        '</p>' +
        '<p><strong>Runtime:</strong> ' +
        movie.Runtime +
        '</p>';
      addMovieBtn.style.display = 'block';
    }
  }

  function populateMoviesTable(movies) {
    let html = '';

    movies.forEach(function(movie) {
      html +=
        '<tr id=movie-' +
        movie.id +
        '><td><img src=' +
        movie.poster +
        '/>' +
        '</td><td>' +
        movie.title +
        '</td><td>' +
        movie.plot +
        '</td><td>' +
        movie.runtime +
        '</td><td>' +
        movie.actors +
        '</td><td> <span class="remove">&times;</span></td></tr>';
    });

    // Insert list items
    document.getElementById(UISelectors.movieTableBody).innerHTML = html;
  }

  return {
    getSelectors: function() {
      return UISelectors;
    },
    displayActiveMovie: displayActiveMovie,
    populateMoviesTable: populateMoviesTable
  };
})();

const MovieCtrl = (function() {
  const Movie = function(id, title, plot, actors, runtime, poster) {
    this.id = id;
    this.title = title;
    this.plot = plot;
    this.actors = actors;
    this.runtime = runtime;
    this.poster = poster;
  };

  // Data Structure / State
  const data = {
    activeMovie: null
  };

  // Public methods
  return {
    addActiveMovie: function() {
      let movieAlreadyOnList = false;
      const movies = StorageCtrl.getMovies();
      const activeMovie = data.activeMovie;
      movies.forEach(movie => {
        if (movie.title === activeMovie.Title) {
          movieAlreadyOnList = true;
        }
      });

      if (!movieAlreadyOnList) {
        const id = Math.random()
          .toString(36)
          .substr(2, 9);
        const newMovie = new Movie(
          id,
          activeMovie.Title,
          activeMovie.Plot,
          activeMovie.Actors,
          activeMovie.Runtime,
          activeMovie.Poster
        );
        StorageCtrl.storeMovie(newMovie);
      }
    },
    removeMovie: function(id) {
      StorageCtrl.deleteMovie(id);
    },
    searchAndSetMovie: function(search) {
      http.get(
        'http://www.omdbapi.com/?i=tt3896198&apikey=2d1317e1&t=' + search,
        function(err, response) {
          if (err) {
            console.log(err);
          } else {
            data.activeMovie = JSON.parse(response);
            UICtrl.displayActiveMovie(data.activeMovie);
          }
        }
      );
    }
  };
})();

const StorageCtrl = (function() {
  function getMoviesfromStorage() {
    let movies;
    const moviesJSON = localStorage.getItem('movies');
    if (moviesJSON === null) {
      movies = [];
    } else {
      movies = JSON.parse(moviesJSON);
    }
    return movies;
  }
  // Public methods
  return {
    storeMovie: function(movie) {
      const movies = getMoviesfromStorage();
      movies.push(movie);
      localStorage.setItem('movies', JSON.stringify(movies));
    },
    getMovies: function() {
      return getMoviesfromStorage();
    },
    deleteMovie: function(id) {
      let movies = JSON.parse(localStorage.getItem('movies'));

      movies.forEach(function(movie, index) {
        if (id === movie.id) {
          movies.splice(index, 1);
        }
      });
      localStorage.setItem('movies', JSON.stringify(movies));
    },
    clearMovies: function() {
      localStorage.removeItem('movies');
    }
  };
})();

// App Controller
const App = (function(MovieCtrl, StorageCtrl, UICtrl) {
  function addEventListeners() {
    const UISelectors = UICtrl.getSelectors();
    const searchInput = document.getElementById(UISelectors.searchMovieInput);
    const addMovieBtn = document.getElementById(UISelectors.addMovieBtn);
    const movieTableBody = document.getElementById(UISelectors.movieTableBody);

    searchInput.addEventListener('input', function(e) {
      if (e.target.value && e.target.value !== '')
        MovieCtrl.searchAndSetMovie(e.target.value);
    });

    addMovieBtn.addEventListener('click', function() {
      MovieCtrl.addActiveMovie();
      const movies = StorageCtrl.getMovies();
      UICtrl.populateMoviesTable(movies);
    });

    movieTableBody.addEventListener('click', removeMovieClick);
  }

  function removeMovieClick(e) {
    if (e.target.classList.contains('remove')) {
      const rowId = e.target.parentNode.parentNode.id;
      const movieId = rowId.split('-')[1];
      MovieCtrl.removeMovie(movieId);
      const movies = StorageCtrl.getMovies();
      UICtrl.populateMoviesTable(movies);
    }
  }
  // Public methods
  return {
    init: function() {
      addEventListeners();
      const movies = StorageCtrl.getMovies();
      UICtrl.populateMoviesTable(movies);
    }
  };
})(MovieCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
