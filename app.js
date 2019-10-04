const http = new simpleHTTP();

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
    movies: [],
    activeMovie: null
  };

  // Public methods
  return {
    getMovies: function() {
      return data.movies;
    },
    addActiveMovie: function() {
      const id = Math.random()
        .toString(36)
        .substr(2, 9);
      const activeMovie = data.activeMovie;
      const newMovie = new Movie(
        id,
        activeMovie.Title,
        activeMovie.Plot,
        activeMovie.Actors,
        activeMovie.Runtime,
        activeMovie.Poster
      );
      StorageCtrl.storeMovie(newMovie);
      data.movies.push(newMovie);
    },
    removeMovie: function(id) {
      const ids = data.movies.map(function(movie) {
        return movie.id;
      });

      const index = ids.indexOf(id);
      data.movies.splice(index, 1);

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
