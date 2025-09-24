// src/components/title/TitleText.tsx
import React from "react";

interface TitleTextProps {
  text: string;
  className?: string;
}

const TitleText: React.FC<TitleTextProps> = ({ text, className = "" }) => {
  return (
    <h1
      className={`text-2xl font-bold text-center mb-6 text-gray-800 ${className}`}
    >
      {text}
    </h1>
  );
};

export default TitleText;
