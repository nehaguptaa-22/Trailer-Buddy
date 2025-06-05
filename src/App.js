import React, { useState, useEffect } from "react";
import MovieList from "./MovieList";
import Playlist from "./Playlist/Playlist";

const API_KEY = "28ebe4237f52c522f985e602fb50be52";

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // ✅ Initialize playlist from localStorage
  const [playlist, setPlaylist] = useState(() => {
    const stored = localStorage.getItem("playlist");
    return stored ? JSON.parse(stored) : [];
  });

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ Save playlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);

  // Fetch genres
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await res.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }
    fetchGenres();
  }, []);

  // Fetch movies
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      let url = "";

      if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${page}&sort_by=popularity.desc`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results) {
          setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
          setHasMore(page < data.total_pages);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page, selectedGenre]);

  // Reset on genre change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [selectedGenre]);

  // Add to playlist
  const addToPlaylist = (movie) => {
    setPlaylist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  // Remove from playlist
  const removeFromPlaylist = (id) => {
    setPlaylist((prev) => prev.filter((m) => m.id !== id));
  };

  // ✅ Clear entire playlist
  const clearPlaylist = () => {
    setPlaylist([]);
  };

  // Load more movies
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4 overflow-auto" style={{ maxHeight: "100vh" }}>
        <h1 className="text-3xl font-bold mb-4">Movies</h1>

        {/* Genre filter buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3 py-1 rounded ${
              selectedGenre === null ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>

          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-3 py-1 rounded ${
                selectedGenre === genre.id ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <MovieList movies={movies} onAddToPlaylist={addToPlaylist} />

        {/* Load More button */}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

      {/* Playlist Section */}
      <div className="w-80 p-4 border-l bg-gray-100 min-h-screen overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">My Playlist</h2>
          {playlist.length > 0 && (
            <button
              onClick={clearPlaylist}
              className="text-sm text-red-600 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        <Playlist movies={playlist} onRemove={removeFromPlaylist} />
      </div>
    </div>
  );
}

export default App;
