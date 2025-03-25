import React from "react";
import { CircularProgress, styled } from "@mui/material";

// Создание стилизованного компонента CircularProgress
const GradientCircularProgress = styled(CircularProgress)(({ theme }) => ({
  '& .MuiCircularProgress-circle': {
    stroke: 'url(#my_gradient)', // Использование линейного градиента
  },
}));

const Loading = ({ loading }) => {
  if (!loading) return null;

  return (
    <>
      <div className="relative h-screen bg-black">
        <svg className="">
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="16.67%" stopColor="#451E7D" />
                <stop offset="33.33%" stopColor="#8A3CFA" />
                <stop offset="50%" stopColor="#9B56FC" />
                <stop offset="66.67%" stopColor="#AB70FD" />
                <stop offset="83.33%" stopColor="#56387F" />
                <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
        </svg>

        {/* Использование кастомного CircularProgress с градиентом */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <GradientCircularProgress thickness={5} size="7rem" />
        </div>
      </div>
    </>
  );
};

export default Loading;
