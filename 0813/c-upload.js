import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

function UploadPage() {
  const location = useLocation();
  const topSimilarImages = location.state?.topSimilarImages || [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    },15000 );
  }, []);

  return (
    <div >
      {loading ? (
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ClipLoader color={'#36a9d6'} loading={loading} size={100} />
        </div>
      ) : (
        <div>
          {topSimilarImages.map((image, index) => (
            <div key={index}>
              <img
                src={image.imagePath}
                alt={`Similar Image ${index}`}
                width="300"
                height="200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadPage;
