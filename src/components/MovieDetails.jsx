import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MovieDetails = ({ movie }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie?.id) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
              accept: "application/json",
            },
          }
        );
        const data = await response.json();

        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Failed to fetch trailer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailer();
  }, [movie]);

  if (!movie) return null;

  const {
    title,
    release_date,
    vote_average,
    overview,
    genres = [],
    poster_path,
    backdrop_path,
    original_language,
    production_companies = [],
    spoken_languages = [],
    budget,
    revenue,
    tagline,
  } = movie;

  return (
    <section className="movie-details text-white px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-6">{title}</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Poster */}
        <div className="flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt={title}
            className="rounded-lg shadow-lg w-full max-w-xs"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Trailer or Backdrop */}
          <div className="w-full h-64 rounded-xl overflow-hidden bg-black">
            {isLoading ? (
              <p className="text-center pt-24 text-gray-400">
                Loading trailer...
              </p>
            ) : trailerKey ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
                alt="Backdrop"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Back Button */}
          <div className="mt-3 text-right">
            <Link
              to="/"
              className="inline-block px-5 py-2 bg-[#470000] hover:bg-[#5c0000] text-white text-sm font-semibold rounded-md transition duration-200"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-[#470000] text-white px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Info */}
          <div className="space-y-1 text-sm text-gray-300">
            {overview && <p className="text-base text-white">{overview}</p>}

            <p>
              <strong>Release Date:</strong> {release_date}
            </p>
            <p>
              <strong>Rating:</strong> {vote_average?.toFixed(1)}/10
            </p>
            <p>
              <strong>Tagline:</strong> {tagline || "—"}
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {spoken_languages.map((lang) => lang.name).join(", ") || "N/A"}
            </p>
            <p>
              <strong>Production Countries:</strong>{" "}
              {production_companies.map((company) => company.name).join(", ") ||
                "N/A"}
            </p>
            <p>
              <strong>Budget:</strong> ${budget?.toLocaleString() || "0"}
            </p>
            <p>
              <strong>Revenue:</strong> ${revenue?.toLocaleString() || "0"}
            </p>
            <p>
              <strong>Original Language:</strong>{" "}
              {original_language?.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;
