import React from "react";
import MovieCard from "./MovieCard";

function MovieList({ movies, playlist = [], onAddToPlaylist, onRemoveFromPlaylist, onRecommend }) {
  return (
    <div
      style={{ backgroundColor: "#001F3F" }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 max-w-screen-lg mx-auto min-h-screen"
    >
      {movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            onAddToPlaylist={onAddToPlaylist}
            onRecommend={onRecommend}
          />
        );
      })}
    </div>
  );
}

export default MovieList;
