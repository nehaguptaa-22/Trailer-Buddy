// src/components/MovieExplorer.js
import React, { useEffect, useState } from "react";
import MovieList from "./MovieList"; // Assuming this is already your movie list component

function MovieExplorer() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const API_KEY = "28ebe4237f52c522f985e602fb50be52";

  // Fetch genres once on mount
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    }
    fetchGenres();
  }, []);

  // Fetch movies when page or selectedGenre changes
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const url = selectedGenre
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${selectedGenre}&page=${page}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

        const response = await fetch(url);
        const data = await response.json();

        setMovies((prevMovies) =>
          page === 1 ? data.results : [...prevMovies, ...data.results]
        );
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page, selectedGenre]);

  // Reset movies and page when genre changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [selectedGenre]);

  // Infinite scroll handler
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div>
      {/* Genre Filter */}
      <div className="mb-6 flex justify-center">
        <select
          className="p-2 border rounded"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Movie List */}
      <MovieList movies={movies} />

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center mt-4 text-gray-600">Loading more movies...</p>
      )}
    </div>
  );
}

export default MovieExplorer;
