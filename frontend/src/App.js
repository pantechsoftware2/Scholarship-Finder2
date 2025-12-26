// Filename: src/App.js
// Fix: Switched to use Results instead of ResultsDisplay and LeadCapture; removed 'lead-capture' stage; onLeadCaptured sets to 'thankyou'.

import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './pages/Results';
import ThankYou from './pages/ThankYou';
import './styles/App.css';

function App() {
  const [currentStage, setCurrentStage] = useState('input');
  const [userProfile, setUserProfile] = useState(null);
  const [scholarshipResults, setScholarshipResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (profile) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://scholarship-finder2-seven.vercel.app/api/calculate-scholarships',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Extract error message from backend response
        let errorMessage = 'Validation failed';
        
        if (result && typeof result.detail === 'string') {
          errorMessage = result.detail;
        } else if (result && Array.isArray(result.detail)) {
          // Handle validation error list
          errorMessage = result.detail
            .map(err => `${err.loc?.join('.')}: ${err.msg}`)
            .join('; ');
        }
        
        console.error('Backend validation error:', result);
        throw new Error(errorMessage);
      }

      setUserProfile(profile);
      setScholarshipResults(result.data);
      setCurrentStage('results');
    } catch (err) {
      setError(err.message || 'Failed to calculate scholarships.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {currentStage === 'input' && (
        <InputForm
          onCalculate={handleCalculate}
          loading={loading}
          error={error}
        />
      )}

      {currentStage === 'results' && (
        <Results
          results={scholarshipResults}
          profile={userProfile}
          onLeadCaptured={() => setCurrentStage('thankyou')}
        />
      )}

      {currentStage === 'thankyou' && <ThankYou />}
    </div>
  );
}

export default App;