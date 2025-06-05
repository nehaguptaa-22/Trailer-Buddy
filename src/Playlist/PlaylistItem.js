import React from "react";

function PlaylistItem({ movie, onRemove }) {
  return (
    <div className="flex items-center bg-white shadow rounded p-2 space-x-3">
      <img
        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
        alt={movie.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex-1 text-sm font-semibold">{movie.title}</div>
      <button
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded whitespace-nowrap"
        onClick={onRemove}
        title="Remove from playlist"
      >
        Remove
      </button>
    </div>
  );
}

export default PlaylistItem;
