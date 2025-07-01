import React from 'react';

const GoogleMapEmbed = ({ location }) => {
  const encodedLocation = encodeURIComponent(location);
  const mapSrc = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;

  return (
    <div style={{ width: '100%', height:'285px', padding: '1rem' }}>
      <iframe
        title="Google Map"
        src={mapSrc}
        style={{
          width: '100%',
          height: '235px',

          border: 'none',
          borderRadius: '10px',
        }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default GoogleMapEmbed;