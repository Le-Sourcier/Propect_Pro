import React from "react";

const Loader: React.FC = () => {
  const dotStyle = (delay: string): React.CSSProperties => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6", // blue-500
    animation: "bounce 0.6s infinite alternate",
    animationDelay: delay,
  });

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9fafb", // gray-50
    fontFamily: "'Inter', sans-serif",
    color: "#1f2937", // gray-800
  };

  const loaderStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  };

  const textStyle: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: 500,
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          from {
            transform: translateY(0);
            opacity: 0.6;
          }
          to {
            transform: translateY(-16px);
            opacity: 1;
          }
        }
      `}</style>
      <div style={wrapperStyle}>
        <div style={loaderStyle}>
          <div style={dotStyle("0s")} />
          <div style={dotStyle("0.2s")} />
          <div style={dotStyle("0.4s")} />
        </div>
        <p style={textStyle}>Chargement en cours...</p>
      </div>
    </>
  );
};

export default Loader;
