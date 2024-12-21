import { useNavigate } from 'react-router-dom';
import './List.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  // Fetch movies from the server
  const getMovies = async () => {
    try {
      const response = await axios.get('/movies');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const isConfirm = window.confirm('Are you sure you want to delete this movie?');
    if (isConfirm) {
      try {
        await axios.delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          className="create"
          onClick={() => navigate('/main/movies/form')}
        >
          Create New
        </button>
      </div>

      <div className="table-container">
        {lists.length > 0 ? (
          <table className="movie-lists">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lists.map(({ id, title }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td className="title-cell">{title}</td>
                  <td>
                    <button
                      className="edit"
                      onClick={() => navigate(`/main/movies/form/${id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">No movies available. Create a new movie to get started.</p>
        )}
      </div>
    </div>
  );
};

export default Lists;
