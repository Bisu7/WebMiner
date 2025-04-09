import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="background-particles">
        {Array(70).fill().map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      <div className="background-grid"></div>
      <div className="content">
        <h1 className="title">Web Miner</h1>
        <p className="subtitle">Web Scraping and Visualization Tool</p>

        <div className="loader">
          <div className="cube">
            <div className="face" />
            <div className="face" />
            <div className="face" />
            <div className="face" />
            <div className="face" />
            <div className="face" />
          </div>
        </div>

        <div className="status-text">
          <p>🔍 Initializing AI modules…</p>
          <p>🧠 Extracting HTML DOM structure…</p>
          <p>📊 Fetching visual components…</p>
          <p>🚀 Almost there...</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #0f172a, #0b1120);
  color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;

  /* Background Grid */
  .background-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(65, 105, 225, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(65, 105, 225, 0.07) 1px, transparent 1px);
    background-size: 40px 40px;
    perspective: 1000px;
    transform-style: preserve-3d;
    animation: gridAnimation 25s linear infinite;
    z-index: 0;
  }

  @keyframes gridAnimation {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 40px;
    }
  }

  /* Animated Particles */
  .background-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: rgba(56, 189, 248, 0.7);
    border-radius: 50%;
    box-shadow: 0 0 10px 2px rgba(56, 189, 248, 0.3);
    animation: particleFloat 15s infinite linear;
  }

  .particle:nth-child(odd) {
    background-color: rgba(129, 140, 248, 0.7);
    box-shadow: 0 0 10px 2px rgba(129, 140, 248, 0.3);
  }

  ${() => {
    let styles = '';
    for (let i = 0; i < 70; i++) {
      const size = Math.random() * 3 + 1;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 15;
      const delay = Math.random() * 5;
      
      styles += `
        .particle:nth-child(${i + 1}) {
          width: ${size}px;
          height: ${size}px;
          top: ${top}%;
          left: ${left}%;
          animation-duration: ${duration}s;
          animation-delay: ${delay}s;
        }
      `;
    }
    return styles;
  }}

  @keyframes particleFloat {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) translateX(100px);
      opacity: 0;
    }
  }

  .content {
    text-align: center;
    position: relative;
    z-index: 10;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
    text-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
  }

  .subtitle {
    font-size: 1.1rem;
    color: #cbd5e1;
    margin-bottom: 2rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-shadow: 0 0 10px #334155;
  }

  .loader {
    perspective: 600px;
    width: 70px;
    height: 70px;
    margin: auto;
  }

  .cube {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotate 4s linear infinite;
    position: relative;
  }

  .face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #38bdf8, #818cf8);
    opacity: 0.85;
    border: 0.5px solid #e2e8f0;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
  }

  .face:nth-child(1) { transform: rotateX(90deg) translateZ(35px); }
  .face:nth-child(2) { transform: rotateX(-90deg) translateZ(35px); }
  .face:nth-child(3) { transform: translateZ(35px); }
  .face:nth-child(4) { transform: rotateY(90deg) translateZ(35px); }
  .face:nth-child(5) { transform: rotateY(-90deg) translateZ(35px); }
  .face:nth-child(6) { transform: rotateY(180deg) translateZ(35px); }

  @keyframes rotate {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg); }
  }

  .status-text {
    margin-top: 2rem;
    font-size: 0.95rem;
    color: #94a3b8;
    line-height: 1.6;
    animation: fadeIn 2s ease-in;
  }

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

export default Loader;