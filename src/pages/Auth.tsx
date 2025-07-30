import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { login, register } = useApp();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container py-12">
      <form className="auth-form animate-fade-in-up" onSubmit={handleSubmit}>
        <h2 className="text-center mb-8">
          {isLogin ? '🏛️ Welcome Back' : '✨ Join Ancient Eats'}
        </h2>
        
        {errors.general && (
          <div className="form-error text-center mb-4 p-3 bg-error-light text-error rounded-lg">
            {errors.general}
          </div>
        )}
        
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name" className="font-semibold">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'border-error' : ''}
              placeholder="Enter your full name"
              required={!isLogin}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email" className="font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'border-error' : ''}
            placeholder="Enter your email address"
            required
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="font-semibold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'border-error' : ''}
            placeholder="Enter your password"
            required
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              {isLogin ? '🔑 Login' : '🚀 Create Account'}
            </>
          )}
        </button>
        
        <div className="auth-links">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="auth-links button"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
