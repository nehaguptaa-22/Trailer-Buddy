import React from "react";
import MovieCard from "../MovieCard";

function FriendRecommendations({ movies, onAddToPlaylist }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onAddToPlaylist={onAddToPlaylist}
        />
      ))}
    </div>
  );
}

export default FriendRecommendations;
