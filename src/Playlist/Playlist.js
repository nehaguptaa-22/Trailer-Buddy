import React from "react";
import PlaylistItem from "./PlaylistItem";

function Playlist({ movies, onRemove }) {
  if (movies.length === 0) {
    return <p className="text-gray-500">Your playlist is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {movies.map((movie) => (
        <PlaylistItem
          key={movie.id}
          movie={movie}
          onRemove={() => onRemove(movie.id)} // pass id to remove handler
        />
      ))}
    </div>
  );
}

export default Playlist;
