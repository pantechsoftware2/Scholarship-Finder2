// Filename: src/components/ResultsDisplay.js
// Shows top scholarship + blurred locked cards. Unlock modal triggers LeadCaptureModal for lead capture.

import React, { useState } from 'react';
import LeadCaptureModal from './LeadCaptureModal';
import '../styles/ResultsDisplay.css';

function ResultsDisplay({ scholarshipResults, userProfile, onUnlock }) {
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [modalTriggered, setModalTriggered] = useState(false);

  const handleLockedCardInteraction = (e) => {
    if (!modalTriggered) {
      if (e && e.preventDefault) { e.preventDefault(); }
      if (e && e.stopPropagation) { e.stopPropagation(); }
      setShowUnlockModal(true);
      setModalTriggered(true);
    }
  };

  const handleScrollTrigger = () => {
    if (!modalTriggered) {
      setShowUnlockModal(true);
      setModalTriggered(true);
    }
  };

  if (!scholarshipResults || !scholarshipResults.scholarships) {
    return <div>Loading results...</div>;
  }

  const topScholarship = scholarshipResults.scholarships[0];
  const lockedScholarships = scholarshipResults.scholarships.slice(1);

  return (
    <div className="results-container">
      <div className="results-header">
        <h1 className="success-text">
          ✨ We found {scholarshipResults.scholarships.length} High-Match Scholarships for you!
        </h1>
        <div className="probability-badge">
          <span className="label">Estimated Success Probability</span>
          <span className="value">{scholarshipResults.summary_probability}%</span>
        </div>
      </div>

      {/* Top Pick Card */}
      <div className="scholarship-card top-pick-card">
        <div className="badge top-pick-badge">Top Pick</div>
        <div className="card-content">
          <h3 className="scholarship-name">{topScholarship.name}</h3>
          <div className="card-meta">
            <span className="amount">{topScholarship.amount}</span>
            <span className="deadline">📅 {topScholarship.deadline}</span>
          </div>
          <div className="match-score-large">
            <span className="score">{topScholarship.match_score}%</span>
            <span className="label">Match</span>
          </div>
          <p className="reason">
            <strong>Why you'll win:</strong> {topScholarship.one_liner_reason}
          </p>
        </div>
      </div>

      {/* Locked Cards */}
      {lockedScholarships.length > 0 && (
        <div className="locked-section">
          <p className="locked-label">Scroll to unlock more matches & strategy tips</p>
          
          <div 
            className="locked-cards-container"
            onClick={handleLockedCardInteraction}
            onWheel={(e) => { if (Math.abs(e.deltaY) > 10) handleScrollTrigger(); }}
            onScroll={handleScrollTrigger}
            onTouchStart={handleScrollTrigger}
          >
            {lockedScholarships.map((scholarship, idx) => (
              <div 
                key={idx} 
                className="scholarship-card locked-card"
                onClick={handleLockedCardInteraction}
              >
                <div className="card-blur-content">
                  <div className="blurred-text"></div>
                  <div className="blurred-text short"></div>
                  <div className="match-score-badge">
                    <span>{scholarship.match_score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showUnlockModal && (
            <div className="modal-overlay" onClick={() => setShowUnlockModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="modal-close" 
                  onClick={() => setShowUnlockModal(false)}
                >
                  ✕
                </button>
                
                <div className="unlock-icon">🔓</div>
                
                <h2>Unlock Your Full List</h2>
                <p className="unlock-subtitle">+ AI Essay Strategy & Personalized Tips</p>
                
                <p className="unlock-description">
                  Get instant access to all {scholarshipResults.scholarships.length} scholarships, winning strategies for each, and a personalized action plan.
                </p>

                <button 
                  className="btn-unlock"
                  onClick={() => {
                    setShowUnlockModal(false);
                    setShowLeadModal(true);
                  }}
                >
                  Continue to Unlock
                </button>

                <p className="modal-footer">
                  Takes less than 60 seconds ⚡
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Locked Cards Message */}
      {lockedScholarships.length === 0 && (
        <div className="no-more-matches">
          <p>This is your top match! 🎉 Enter your details below to get personalized strategy tips.</p>
          <button 
            className="btn-unlock"
            onClick={() => setShowLeadModal(true)}
            style={{ marginTop: '20px' }}
          >
            Send My Full Report 📧
          </button>
        </div>
      )}

      {/* Lead Capture Modal */}
      {showLeadModal && (
        <LeadCaptureModal 
          scholarships={scholarshipResults}
          profile={userProfile || {}}
          onClose={() => setShowLeadModal(false)}
          onSuccess={() => {
            setShowLeadModal(false);
            if (onUnlock) onUnlock();
          }}
        />
      )}
    </div>
  );
}

export default ResultsDisplay;