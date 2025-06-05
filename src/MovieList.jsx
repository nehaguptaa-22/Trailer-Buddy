import React, { useEffect, useState } from "react";

function MovieCard({ movie, onAddToPlaylist, onRecommend }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showRecommendInput, setShowRecommendInput] = useState(false);
  const [friendName, setFriendName] = useState("");

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=28ebe4237f52c522f985e602fb50be52`
        );
        const data = await res.json();
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error("Error fetching trailer:", err);
      }
    }

    fetchTrailer();
  }, [movie.id]);

  const handleRecommendSubmit = () => {
    if (friendName.trim()) {
      onRecommend(movie, friendName.trim());
      setFriendName("");
      setShowRecommendInput(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow bg-white flex flex-col">
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-60 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>

      <button
        onClick={() => onAddToPlaylist(movie)}
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add to Playlist
      </button>

      {showRecommendInput ? (
        <div className="mt-2 flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Your name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleRecommendSubmit}
              className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 text-sm"
            >
              Send Recommendation
            </button>
            <button
              onClick={() => {
                setShowRecommendInput(false);
                setFriendName("");
              }}
              className="flex-1 bg-gray-300 py-1 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowRecommendInput(true)}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Recommend
        </button>
      )}

      {trailerKey && (
        <div className="mt-4">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title={`${movie.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
}

function MovieList({ movies, onAddToPlaylist, onRecommend }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onAddToPlaylist={onAddToPlaylist}
          onRecommend={onRecommend}  // pass recommend callback here
        />
      ))}
    </div>
  );
}

export default MovieList;
