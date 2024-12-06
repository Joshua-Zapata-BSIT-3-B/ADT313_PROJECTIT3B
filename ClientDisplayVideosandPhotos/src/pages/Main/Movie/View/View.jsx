import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(`/movies/${movieId}`);
        setMovie(data);
      } catch (error) {
        console.error("Failed to load movie:", error);
        navigate('/');
      }
    };

    fetchMovie();
  }, [movieId, setMovie, navigate]);

  if (!movie) {
    return null;
  }

  const renderCastList = () => (
    <div className="section">
      <h2>Cast & Crew</h2>
      <ul className="cast-list">
        {movie.casts?.map((cast, index) => (
          <li key={index}>{cast.name}</li>
        ))}
      </ul>
    </div>
  );

  const renderVideos = () => (
    <div className="section">
      <h2>Videos</h2>
      <div className="video-gallery">
        {movie.videos?.map((video, index) => (
          <video key={index} controls>
            <source src={video.url} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="section">
      <h2>Photos</h2>
      <div className="photo-gallery">
        {movie.photos?.map((photo, index) => (
          <img
            className="img"
            key={index}
            src={photo.url}
            alt={`Movie Photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="banner">
        <h1>{movie.title}</h1>
      </div>
      <h3>{movie.overview}</h3>
      {renderCastList()}
      {renderVideos()}
      {renderPhotos()}
    </div>
  );
}

export default View;
