const http = new simpleHTTP();

const MovieCtrl = (function() {
  const Movie = function(id, title, plot, actors, runtime, poster) {
    this.id = id;
    this.title = title;
    this.plot = plot;
    this.actors = actors;
    this.actors = runtime;
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
      data.movies.push(newMovie);
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
