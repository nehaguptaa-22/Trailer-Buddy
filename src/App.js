import React, { useState, useEffect } from "react";
import MovieList from "./MovieList";
import Playlist from "./Playlist/Playlist";

const API_KEY = "28ebe4237f52c522f985e602fb50be52";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [playlist, setPlaylist] = useState(() => {
    const stored = localStorage.getItem("playlist");
    return stored ? JSON.parse(stored) : [];
  });

  const [recommendations, setRecommendations] = useState(() => {
    const stored = localStorage.getItem("recommendations");
    return stored ? JSON.parse(stored) : {};
  });

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem("recommendations", JSON.stringify(recommendations));
  }, [recommendations]);

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

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      let url = "";

      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${page}&sort_by=popularity.desc`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          setMovies((prev) =>
            page === 1 ? data.results : [...prev, ...data.results]
          );
          setHasMore(page < data.total_pages);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page, selectedGenre, searchQuery]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedGenre]);

  const addToPlaylist = (movie) => {
    setPlaylist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeFromPlaylist = (id) => {
    setPlaylist((prev) => prev.filter((m) => m.id !== id));
  };

  const clearPlaylist = () => {
    setPlaylist([]);
  };

  const handleRecommend = (movie, friendName) => {
    setRecommendations((prev) => {
      const prevNames = prev[movie.id] || [];
      if (!prevNames.includes(friendName)) {
        return { ...prev, [movie.id]: [...prevNames, friendName] };
      }
      return prev;
    });
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4 overflow-auto" style={{ maxHeight: "100vh" }}>
        <h1 className="text-3xl font-bold mb-4 text-blue-900">Movies</h1>

        <SearchBar onSearch={setSearchQuery} />

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedGenre(null);
              setSearchQuery("");
            }}
            className={`px-3 py-1 rounded ${
              selectedGenre === null && !searchQuery
                ? "bg-blue-900 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                setSelectedGenre(genre.id);
                setSearchQuery("");
              }}
              className={`px-3 py-1 rounded ${
                selectedGenre === genre.id
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <MovieList
          movies={movies}
          playlist={playlist}
          onAddToPlaylist={addToPlaylist}
          onRemoveFromPlaylist={removeFromPlaylist}
          onRecommend={handleRecommend}
        />

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="mt-4 w-full py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

      <div className="w-80 p-4 border-l bg-gray-100 min-h-screen overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-blue-900">My Playlist</h2>
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
