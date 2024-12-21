import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    role: 'user',
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const { email, password, firstName, lastName, middleName, contactNo } = formData;
    const newErrors = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!contactNo) newErrors.contactNo = 'Contact number is required';

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailPattern.test(email)) newErrors.email = 'Invalid email format';

    const contactNoPattern = /^\d{11}$/;
    if (contactNo && !contactNoPattern.test(contactNo)) {
      newErrors.contactNo = 'Contact number must be exactly 11 digits';
    }

    const namePattern = /^[A-Za-z]+$/;
    if (firstName && !namePattern.test(firstName)) {
      newErrors.firstName = 'First name must contain only letters';
    }
    if (lastName && !namePattern.test(lastName)) {
      newErrors.lastName = 'Last name must contain only letters';
    }
    if (middleName && !namePattern.test(middleName)) {
      newErrors.middleName = 'Middle name must contain only letters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    setStatus('loading');
    try {
      await axios.post('/user/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setStatus('success');
      alert('User registered successfully');

      const { data } = await axios.post('/user/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('accessToken', data.access_token);
      navigate('/');
    } catch (error) {
      setStatus('error');
      alert('Failed to register');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="Register">
      <div className="main-container">
        <h3>Register</h3>
        <form>
          <div className="form-containerg">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleOnChange}
                required
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleOnChange}
                required
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleOnChange}
                required
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
            <div className="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleOnChange}
              />
              {errors.middleName && <p className="error">{errors.middleName}</p>}
            </div>
            <div className="form-group">
              <label>Contacts:</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleOnChange}
                required
              />
              {errors.contactNo && <p className="error">{errors.contactNo}</p>}
            </div>
            <div className="submit-container">
              <button
                className="btn-register"
                type="button"
                onClick={handleRegister}
                disabled={status === 'loading'}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>
            <div className="reg-container">
              <small>Already have an account? </small>
              <a href="/">
                <small>Log In</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
