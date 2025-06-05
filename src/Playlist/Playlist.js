import React from "react";
import MovieCard from "../MovieCard";
 // this is important!

function Playlist({ movies, onRemove }) {
  return (
    <div className="space-y-4">
      {movies.length === 0 ? (
        <p className="text-gray-600">Your playlist is empty.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie.id} className="relative">
            <MovieCard movie={movie} />
            <button
              onClick={() => onRemove(movie.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Playlist;
