import React, { useState } from 'react';

const TrackedButton = ({ onClick, trackingEndpoint, children, className = '', ...props }) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleClick = async (e) => {
    if (isTracking) return;

    if (trackingEndpoint) {
      setIsTracking(true);
      try {
        // Send analytical increment to database
        const apiModule = await import('../api/axios');
        const api = apiModule.default;
        await api.patch(trackingEndpoint);
      } catch (error) {
        console.error('Tracking dispatch error:', error);
      } finally {
        setIsTracking(false);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className}`}
      disabled={isTracking}
      {...props}
    >
      {children}
    </button>
  );
};

export default TrackedButton;
