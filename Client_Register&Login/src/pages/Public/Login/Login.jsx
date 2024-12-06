import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [status, setStatus] = useState('idle');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (failedAttempts >= 3) {
      const currentTime = Date.now();
      if (currentTime < lockoutTime) {
        const timeLeft = Math.ceil((lockoutTime - currentTime) / 1000);
        alert(`Too many failed attempts. Please try again in ${timeLeft} seconds.`);
        return;
      } else {
        setFailedAttempts(0);
      }
    }

    setStatus('loading');
    try {
      const { data } = await axios.post('/user/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      localStorage.setItem('accessToken', data.access_token);
      navigate('/');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setFailedAttempts((prevAttempts) => prevAttempts + 1);
      if (failedAttempts + 1 >= 3) {
        const currentTime = Date.now();
        setLockoutTime(currentTime + 30000);
        alert('Too many failed attempts. You are locked out for 30 seconds.');
      } else {
        alert('Incorrect email or password. Please try again.');
      }
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Login</h3>
        <form>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleOnChange}
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={handleShowPasswordToggle}
            >
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
          </div>
          <div className="submit-container">
            <button
              className="btn-login"
              type="button"
              onClick={handleLogin}
              disabled={status === 'loading'}
            >
              {status === 'idle' ? 'Login' : 'Loading...'}
            </button>
          </div>
          <div className="reg-container">
            <small>Don't have an account? </small>
            <a href="/register">
              <small>Register</small>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
