import React, { useEffect, useState } from "react";

function MovieCard({ movie, onAddToPlaylist, onRecommend }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showRecommendInput, setShowRecommendInput] = useState(false);
  const [friendName, setFriendName] = useState("");
  const API_KEY = "28ebe4237f52c522f985e602fb50be52";

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        const trailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        console.error("Error fetching trailer:", error);
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
    <div className="border rounded p-4 w-64 bg-white shadow flex flex-col">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-80 object-cover rounded"
      />
      <h3 className="text-xl font-semibold mt-2">{movie.title}</h3>
      <p className="text-sm mb-2">
        <strong>Rating:</strong> {movie.vote_average}
      </p>
      {trailerKey && (
        <div className="mt-2">
          <iframe
            title="Trailer"
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      )}
      
      <button
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onAddToPlaylist(movie)}
      >
        Add to Playlist
      </button>

      {showRecommendInput ? (
        <div className="mt-3 flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Friend's name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleRecommendSubmit}
              className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700 text-sm"
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
          className="mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Recommend
        </button>
      )}
    </div>
  );
}

export default MovieCard;
