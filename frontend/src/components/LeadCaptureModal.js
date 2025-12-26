// Filename: src/components/LeadCaptureModal.js
// No changes, but ensured onSuccess calls after email send.

import React, { useState } from 'react';
import '../styles/LeadCaptureModal.css';

function LeadCaptureModal({ scholarships, profile, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        user_profile: profile,
        scholarship_results: scholarships
      };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit form');
      }

      const result = await response.json();
      console.log('✅ Lead submitted successfully:', result);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('❌ Error submitting lead:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="unlock-icon">🔓</div>
          <h2>Unlock Your Full List</h2>
          <p className="unlock-subtitle">+ AI Essay Strategy & Personalized Tips</p>
        </div>

        <p className="unlock-description">
          Get instant access to all {scholarships?.length || 0} scholarships, winning strategies for each, and a personalized action plan.
        </p>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">WhatsApp Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Sending your report...' : 'Send My Full Report'}
          </button>

          <p className="form-footer">
            ✅ We'll email your full report instantly<br/>
            📧 Check your inbox (and spam folder) within 2 minutes
          </p>
        </form>

        <p className="modal-footer">
          Takes less than 60 seconds ⚡
        </p>
      </div>
    </div>
  );
}

export default LeadCaptureModal;