import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  return (
    <button className="back-btn"><ArrowBackIcon sx={{ fontSize: 12 }} /> Back</button>
  );
};

export default BackButton;
