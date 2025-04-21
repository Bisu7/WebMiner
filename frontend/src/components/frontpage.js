import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const WebMinerLanding = ({ setUser }) => {
  const [isModelRotating, setIsModelRotating] = useState(true);
  
  // Animation for the floating 3D model
  useEffect(() => {
    const interval = setInterval(() => {
      setIsModelRotating(prev => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full m-0 p-0 box-border">

    <StyledWrapper>
      {/* Background Elements */}
      <div className="background-particles">
        {Array(70).fill().map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      <div className="background-grid"></div>
      
      {/* Main Content */}
      <div className="content">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
        <Footer />
      </div>
    </StyledWrapper>
    </div>
  );
};

// Header Component
const Header = ({setUser}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const clientId = "486633608588-7c1lb83j8q6jti9beb9ra8dqipv4v6t9.apps.googleusercontent.com";
    const redirectUri = "http://localhost:3000/oauth-callback.html"; // or your actual redirect URI
    const scope = "email profile openid";
    const responseType = "token id_token";

    const nonce = crypto.randomUUID(); // generates a secure unique nonce

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&include_granted_scopes=true&prompt=select_account&nonce=${nonce}`;


    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const loginWindow = window.open(
      authUrl,
      "GoogleLoginPopup",
      `width=${width},height=${height},top=${top},left=${left}`
    );
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;
  
      const { type, user } = event.data;
      if (type === 'google-auth') {
        // ✅ Received tokens
        window.removeEventListener("message", messageListener);
        loginWindow.close();
        localStorage.setItem('user',JSON.stringify(user));
        if (typeof setUser === "function") {
          setUser(user); // ✅ Call only if it's a function
        } else {
          console.error("setUser is not a function");
        }
        // Save tokens, call backend, etc.
        navigate('/dashboard'); // Navigate to dashboard
      }
    };
  
    window.addEventListener("message", messageListener);
  };
  return (
    <nav className="header">
      <div className="logo">
        <div className="logo-cube">
          <div className="logo-face" />
          <div className="logo-face" />
          <div className="logo-face" />
          <div className="logo-face" />
          <div className="logo-face" />
          <div className="logo-face" />
        </div>
        <span>Web Miner</span>
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="cta-buttons">
        <button className="login-btn" onClick={handleClick}>Log in
        {/* <GoogleLogin /> */}
        </button>
        <button className="signup-btn">Sign Up Free</button>
      </div>
    </nav>
  );
};

// Hero Component
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Extract & Visualize Web Data With AI</h1>
        <p>Transform any website into structured, actionable insights with our advanced scraping and visualization tools.</p>
        <div className="hero-cta">
          <button className="primary-btn">Try It Now</button>
          <button className="secondary-btn">Watch Demo</button>
        </div>
      </div>
      <div className="hero-3d-model">
        <div className="data-sphere">
          <div className="sphere-core"></div>
          <div className="orbit orbit-1">
            <div className="node"></div>
            <div className="node"></div>
          </div>
          <div className="orbit orbit-2">
            <div className="node"></div>
            <div className="node"></div>
            <div className="node"></div>
          </div>
          <div className="orbit orbit-3">
            <div className="node"></div>
            <div className="node"></div>
            <div className="node"></div>
            <div className="node"></div>
          </div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
        </div>
      </div>
    </section>
  );
};

// const GoogleLogin = () => {
//   useEffect(() => {
//     /* global google */
//     window.google.accounts.id.initialize({
//       client_id: "739213241777-80tecrlbicqn4vgi5rl95ko69vq1c31n.apps.googleusercontent.com",
//       callback: handleCredentialResponse,
//     });
//   }, []);

//   const handleCredentialResponse = (response) => {
//     console.log("Encoded JWT ID token: " + response.credential);
//     // Optional: decode or send to backend
//   };

//   const handleClick = () => {
//     window.google.accounts.id.prompt(); // Show the Google login prompt
//   };

//   // return (
//   //   <button onClick={handleClick} className="login-btn">
//   //     <img src="/google-icon.svg" alt="Google" style={{ height: 20, marginRight: 8 }} />
//   //     Sign in with Google
//   //   </button>
//   // );
// };

// Features Component
const Features = () => {
  const features = [
    {
      icon: "🔍",
      title: "Deep Content Analysis",
      description: "Extract text, images, links, and metadata from any webpage with our AI-powered analysis engine."
    },
    {
      icon: "📊",
      title: "Interactive Visualizations",
      description: "Transform extracted data into beautiful, interactive charts and graphs for deeper insights."
    },
    {
      icon: "🖼️",
      title: "Media Discovery",
      description: "Automatically identify and extract all images, videos, and other media elements on the page."
    },
    {
      icon: "🔗",
      title: "3D Structure Mapping",
      description: "View website architecture in an interactive 3D model that reveals connections and hierarchies."
    },
    {
      icon: "📱",
      title: "Cross-Device Analysis",
      description: "Compare how websites render across different devices with our responsive simulation engine."
    },
    {
      icon: "⚡",
      title: "Real-Time Processing",
      description: "Process and visualize web data in real-time with our high-performance cloud infrastructure."
    }
  ];

  return (
    <section className="features" id="features">
      <h2>Powerful Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className="feature-glow"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

// How It Works Component
const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        <div className="step">
          <div className="step-number">01</div>
          <div className="step-content">
            <h3>Enter URL</h3>
            <p>Simply paste the web address you want to analyze into our intuitive interface.</p>
          </div>
          <div className="step-3d">
            <div className="url-input-model">
              <div className="input-bar"></div>
              <div className="submit-button"></div>
            </div>
          </div>
        </div>
        
        <div className="connector"></div>
        
        <div className="step">
          <div className="step-number">02</div>
          <div className="step-content">
            <h3>AI Analysis</h3>
            <p>Our advanced algorithms scan and process the webpage in seconds, extracting all valuable data.</p>
          </div>
          <div className="step-3d">
            <div className="processing-model">
              <div className="processing-cube">
                <div className="p-face" />
                <div className="p-face" />
                <div className="p-face" />
                <div className="p-face" />
                <div className="p-face" />
                <div className="p-face" />
              </div>
              <div className="processing-beam"></div>
            </div>
          </div>
        </div>
        
        <div className="connector"></div>
        
        <div className="step">
          <div className="step-number">03</div>
          <div className="step-content">
            <h3>Visualization</h3>
            <p>Review the extracted data in beautiful, interactive visualizations that reveal patterns and insights.</p>
          </div>
          <div className="step-3d">
            <div className="viz-model">
              <div className="chart-bar chart-bar-1"></div>
              <div className="chart-bar chart-bar-2"></div>
              <div className="chart-bar chart-bar-3"></div>
              <div className="chart-bar chart-bar-4"></div>
            </div>
          </div>
        </div>
        
        <div className="connector"></div>
        
        <div className="step">
          <div className="step-number">04</div>
          <div className="step-content">
            <h3>Export & Share</h3>
            <p>Download your results in multiple formats or share interactive reports with your team.</p>
          </div>
          <div className="step-3d">
            <div className="export-model">
              <div className="document"></div>
              <div className="share-beam"></div>
              <div className="share-target"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      text: "Web Miner has transformed our competitive analysis process. The 3D visualizations make complex website structures easy to understand at a glance.",
      author: "Sarah Chen",
      role: "Digital Marketing Director"
    },
    {
      text: "As an SEO consultant, this tool has become essential to my workflow. The depth of analysis and beautiful data presentation gives me an edge over competitors.",
      author: "Michael Rodriguez",
      role: "SEO Specialist"
    },
    {
      text: "The speed and accuracy of Web Miner is incredible. What used to take our research team days now happens in minutes with even better results.",
      author: "Aisha Johnson",
      role: "UX Research Lead"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                {testimonial.author.split(' ').map(word => word[0]).join('')}
              </div>
              <div className="author-info">
                <h4>{testimonial.author}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Call To Action Component
const CallToAction = () => {
  return (
    <section className="cta" id="contact">
      <div className="cta-content">
        <h2>Ready to transform how you analyze web data?</h2>
        <p>Join thousands of researchers, marketers, and developers who are extracting valuable insights with Web Miner.</p>
        <div className="cta-form">
          <input type="email" placeholder="Enter your email address" />
          <button className="cta-button">Get Started Free</button>
        </div>
        <div className="cta-features">
          <div className="cta-feature">✓ No credit card required</div>
          <div className="cta-feature">✓ 14-day free trial</div>
          <div className="cta-feature">✓ Cancel anytime</div>
        </div>
      </div>
      <div className="cta-3d-model">
        <div className="floating-dashboard">
          <div className="dashboard-panel"></div>
          <div className="data-point data-point-1"></div>
          <div className="data-point data-point-2"></div>
          <div className="data-point data-point-3"></div>
          <div className="connection-line"></div>
          <div className="connection-line"></div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <div className="footer-logo">
            <div className="footer-logo-cube">
              <div className="f-logo-face" />
              <div className="f-logo-face" />
              <div className="f-logo-face" />
              <div className="f-logo-face" />
              <div className="f-logo-face" />
              <div className="f-logo-face" />
            </div>
            <span>Web Miner</span>
          </div>
          <p>Advanced web scraping and visualization tools powered by AI.</p>
          <div className="social-links">
            <a href="#" className="social-link">Tw</a>
            <a href="#" className="social-link">Li</a>
            <a href="#" className="social-link">Fb</a>
            <a href="#" className="social-link">Ig</a>
          </div>
        </div>
        
        <div className="footer-column">
          <h4>Product</h4>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Integrations</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Tutorials</a></li>
            <li><a href="#">Community</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Legal</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Web Miner. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at center, #0f172a, #0b1120);
  color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow-x: hidden;

  /* Background Grid */
  .background-grid {
    position: fixed;
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
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
    position: relative;
    z-index: 10;
    width: 100%;
  }

  /* Header/Navigation Styles */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 5%;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(56, 189, 248, 0.1);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f8fafc;
    cursor: pointer;
  }

  /* Logo 3D Cube */
  .logo-cube {
    width: 24px;
    height: 24px;
    transform-style: preserve-3d;
    animation: rotate 10s linear infinite;
    position: relative;
  }

  .logo-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #38bdf8, #818cf8);
    opacity: 0.85;
    border: 0.5px solid #e2e8f0;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
  }

  .logo-face:nth-child(1) { transform: rotateX(90deg) translateZ(12px); }
  .logo-face:nth-child(2) { transform: rotateX(-90deg) translateZ(12px); }
  .logo-face:nth-child(3) { transform: translateZ(12px); }
  .logo-face:nth-child(4) { transform: rotateY(90deg) translateZ(12px); }
  .logo-face:nth-child(5) { transform: rotateY(-90deg) translateZ(12px); }
  .logo-face:nth-child(6) { transform: rotateY(180deg) translateZ(12px); }

  @keyframes rotate {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg); }
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-links a:hover {
    color: #38bdf8;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    transition: width 0.3s ease;
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
  }

  .login-btn, .signup-btn {
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-btn {
    background: transparent;
    color: #f8fafc;
    border: 1px solid rgba(56, 189, 248, 0.5);
  }

  .login-btn:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: #38bdf8;
  }

  .signup-btn {
    background: linear-gradient(to right, #38bdf8, #818cf8);
    color: white;
    border: none;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
  }

  .signup-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
  }

  /* Hero Section */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5rem 5%;
    min-height: 85vh;
    position: relative;
  }

  .hero-content {
    max-width: 600px;
    animation: fadeIn 1s ease-in;
  }

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
    text-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  }

  .hero p {
    font-size: 1.2rem;
    color: #cbd5e1;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
  }

  .primary-btn, .secondary-btn {
    padding: 0.8rem 1.8rem;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .primary-btn {
    background: linear-gradient(to right, #38bdf8, #818cf8);
    color: white;
    border: none;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
  }

  .primary-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
  }

  .secondary-btn {
    background: transparent;
    color: #f8fafc;
    border: 1px solid rgba(56, 189, 248, 0.5);
  }

  .secondary-btn:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: #38bdf8;
  }

  /* 3D Model in Hero Section */
  .hero-3d-model {
    position: relative;
    width: 400px;
    height: 400px;
    perspective: 800px;
  }

  .data-sphere {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotateSphere 20s linear infinite;
  }

  @keyframes rotateSphere {
    0% { transform: rotateY(0) rotateX(20deg); }
    100% { transform: rotateY(360deg) rotateX(20deg); }
  }

  .sphere-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: radial-gradient(circle at center, #38bdf8, #818cf8);
    border-radius: 50%;
    box-shadow: 0 0 30px rgba(56, 189, 248, 0.8);
  }

  .orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px dashed rgba(56, 189, 248, 0.3);
    border-radius: 50%;
    transform-style: preserve-3d;
  }

  .orbit-1 {
    width: 150px;
    height: 150px;
    animation: rotateOrbit1 12s linear infinite;
  }

  .orbit-2 {
    width: 250px;
    height: 250px;
    animation: rotateOrbit2 18s linear infinite;
  }

  .orbit-3 {
    width: 350px;
    height: 350px;
    animation: rotateOrbit3 24s linear infinite;
  }

  @keyframes rotateOrbit1 {
    0% { transform: translate(-50%, -50%) rotateZ(0) rotateX(60deg); }
    100% { transform: translate(-50%, -50%) rotateZ(360deg) rotateX(60deg); }
  }

  @keyframes rotateOrbit2 {
    0% { transform: translate(-50%, -50%) rotateZ(0) rotateX(30deg); }
    100% { transform: translate(-50%, -50%) rotateZ(-360deg) rotateX(30deg); }
  }

  @keyframes rotateOrbit3 {
    0% { transform: translate(-50%, -50%) rotateZ(0) rotateX(15deg); }
    100% { transform: translate(-50%, -50%) rotateZ(360deg) rotateX(15deg); }
  }

  .node {
    position: absolute;
    width: 15px;
    height: 15px;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.6);
  }

  .orbit-1 .node:nth-child(1) { top: 0; left: 50%; transform: translate(-50%, -50%); }
  .orbit-1 .node:nth-child(2) { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
  
  .orbit-2 .node:nth-child(1) { top: 0; left: 50%; transform: translate(-50%, -50%); }
  .orbit-2 .node:nth-child(2) { top: 50%; right: 0; transform: translate(50%, -50%); }
  .orbit-2 .node:nth-child(3) { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
  
  .orbit-3 .node:nth-child(1) { top: 0; left: 50%; transform: translate(-50%, -50%); }
  .orbit-3 .node:nth-child(2) { top: 50%; right: 0; transform: translate(50%, -50%); }
  .orbit-3 .node:nth-child(3) { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
  .orbit-3 .node:nth-child(4) { top: 50%; left: 0; transform: translate(-50%, -50%); }

  .data-stream {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 175px;
    background: linear-gradient(to top, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0.8));
    transform-origin: bottom center;
  }

  .data-stream:nth-child(1) { transform: translate(-50%, -50%) rotateX(0deg); }
  .data-stream:nth-child(2) { transform: translate(-50%, -50%) rotateX(120deg); }
  .data-stream:nth-child(3) { transform: translate(-50%, -50%) rotateX(240deg); }

  /* Features Section */
  .features {
    padding: 6rem 5%;
    position: relative;
  }

  .features h2, .how-it-works h2, .testimonials h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 3rem;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 12px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    border-color: rgba(56, 189, 248, 0.5);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1.2rem;
  }

  .feature-card h3 {
    font-size: 1.4rem;
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .feature-card p {
    color: #cbd5e1;
    line-height: 1.6;
  }

  .feature-glow {
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at center, rgba(56, 189, 248, 0.4), transparent 70%);
    border-radius: 50%;
    opacity:opacity: 0.7;
  }

  /* How It Works Section */
  .how-it-works {
    padding: 6rem 5%;
    background: linear-gradient(to bottom, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0));
  }

  .steps-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .step {
    display: flex;
    align-items: center;
    margin-bottom: 3rem;
    gap: 2rem;
  }

  .step-number {
    font-size: 4rem;
    font-weight: 800;
    color: rgba(56, 189, 248, 0.2);
    line-height: 1;
    min-width: 80px;
    text-align: center;
  }

  .step-content {
    flex: 1;
  }

  .step-content h3 {
    font-size: 1.8rem;
    color: #f8fafc;
    margin-bottom: 0.8rem;
  }

  .step-content p {
    color: #cbd5e1;
    line-height: 1.6;
    font-size: 1.1rem;
  }

  .step-3d {
    width: 180px;
    height: 180px;
    position: relative;
    perspective: 600px;
  }

  /* URL Input Model */
  .url-input-model {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: floatInput 4s ease-in-out infinite;
  }

  @keyframes floatInput {
    0%, 100% { transform: translateY(0) rotateX(10deg); }
    50% { transform: translateY(-10px) rotateX(10deg); }
  }

  .input-bar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 140px;
    height: 40px;
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(56, 189, 248, 0.7);
    border-radius: 6px;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  }

  .submit-button {
    position: absolute;
    top: 50%;
    right: 30px;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
  }

  /* Processing Cube */
  .processing-model {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .processing-cube {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    transform-style: preserve-3d;
    animation: processingRotate 6s linear infinite;
  }

  @keyframes processingRotate {
    0% { transform: translate(-50%, -50%) rotateX(0) rotateY(0); }
    100% { transform: translate(-50%, -50%) rotateX(360deg) rotateY(360deg); }
  }

  .p-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(56, 189, 248, 0.7), rgba(129, 140, 248, 0.7));
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  }

  .p-face:nth-child(1) { transform: rotateX(90deg) translateZ(30px); }
  .p-face:nth-child(2) { transform: rotateX(-90deg) translateZ(30px); }
  .p-face:nth-child(3) { transform: translateZ(30px); }
  .p-face:nth-child(4) { transform: rotateY(90deg) translateZ(30px); }
  .p-face:nth-child(5) { transform: rotateY(-90deg) translateZ(30px); }
  .p-face:nth-child(6) { transform: rotateY(180deg) translateZ(30px); }

  .processing-beam {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 2px dashed rgba(56, 189, 248, 0.5);
    animation: pulseBeam 3s ease-in-out infinite;
  }

  @keyframes pulseBeam {
    0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
  }

  /* Visualization Model */
  .viz-model {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateX(20deg);
    animation: floatViz 5s ease-in-out infinite;
  }

  @keyframes floatViz {
    0%, 100% { transform: rotateX(20deg) translateY(0); }
    50% { transform: rotateX(20deg) translateY(-10px); }
  }

  .chart-bar {
    position: absolute;
    bottom: 50%;
    width: 20px;
    background: linear-gradient(to top, #38bdf8, #818cf8);
    border-radius: 4px 4px 0 0;
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
  }

  .chart-bar-1 {
    height: 60px;
    left: 25%;
    animation: barGrow1 3s ease-in-out infinite;
  }

  .chart-bar-2 {
    height: 90px;
    left: 40%;
    animation: barGrow2 3s ease-in-out infinite;
  }

  .chart-bar-3 {
    height: 40px;
    left: 55%;
    animation: barGrow3 3s ease-in-out infinite;
  }

  .chart-bar-4 {
    height: 70px;
    left: 70%;
    animation: barGrow4 3s ease-in-out infinite;
  }

  @keyframes barGrow1 {
    0%, 100% { height: 60px; }
    50% { height: 70px; }
  }

  @keyframes barGrow2 {
    0%, 100% { height: 90px; }
    50% { height: 80px; }
  }

  @keyframes barGrow3 {
    0%, 100% { height: 40px; }
    50% { height: 55px; }
  }

  @keyframes barGrow4 {
    0%, 100% { height: 70px; }
    50% { height: 60px; }
  }

  /* Export Model */
  .export-model {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: floatExport 4s ease-in-out infinite;
  }

  @keyframes floatExport {
    0%, 100% { transform: translateY(0) rotateZ(0); }
    50% { transform: translateY(-10px) rotateZ(2deg); }
  }

  .document {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 100px;
    background: rgba(241, 245, 249, 0.9);
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
  }

  .document::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    width: 50px;
    height: 4px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 2px;
    box-shadow: 0 10px 0 rgba(15, 23, 42, 0.5), 0 20px 0 rgba(15, 23, 42, 0.5), 
                0 30px 0 rgba(15, 23, 42, 0.5), 0 40px 0 rgba(15, 23, 42, 0.5);
  }

  .share-beam {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 4px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0));
    transform-origin: top center;
    transform: rotate(45deg);
    animation: pulseBeamShare 2s ease-in-out infinite;
  }

  @keyframes pulseBeamShare {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }

  .share-target {
    position: absolute;
    bottom: 30%;
    right: 20%;
    width: 30px;
    height: 30px;
    background: rgba(56, 189, 248, 0.9);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.6);
    animation: pulseTarget 2s ease-in-out infinite;
  }

  @keyframes pulseTarget {
    0%, 100% { transform: scale(0.9); }
    50% { transform: scale(1.1); }
  }

  .connector {
    width: 2px;
    height: 50px;
    background: linear-gradient(to bottom, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.6));
    margin: 0 auto 3rem auto;
  }

  /* Testimonials Section */
  .testimonials {
    padding: 6rem 5%;
  }

  .testimonials-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .testimonial-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 12px;
    padding: 2rem;
    width: 350px;
    position: relative;
    transition: all 0.3s ease;
  }

  .testimonial-card:hover {
    transform: translateY(-5px);
    border-color: rgba(56, 189, 248, 0.5);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.6);
  }

  .testimonial-quote {
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: 4rem;
    color: rgba(56, 189, 248, 0.2);
    font-family: serif;
    line-height: 0.8;
  }

  .testimonial-text {
    color: #cbd5e1;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .author-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #38bdf8, #818cf8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .author-info h4 {
    color: #f8fafc;
    margin: 0;
    font-size: 1rem;
  }

  .author-info span {
    color: #94a3b8;
    font-size: 0.85rem;
  }

  /* Call To Action Section */
  .cta {
    padding: 6rem 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.5));
    border-radius: 20px;
    margin: 0 5% 6rem 5%;
    position: relative;
    overflow: hidden;
  }

  .cta::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2338bdf8' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: -1;
  }

  .cta-content {
    max-width: 600px;
    padding-right: 2rem;
  }

  .cta h2 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
    color: #f8fafc;
    text-align: left;
  }

  .cta p {
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .cta-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .cta-form input {
    flex: 1;
    padding: 0.8rem 1.2rem;
    border-radius: 5px;
    border: 1px solid rgba(56, 189, 248, 0.3);
    background: rgba(15, 23, 42, 0.5);
    color: #f8fafc;
    font-size: 1rem;
  }

  .cta-form input:focus {
    outline: none;
    border-color: rgba(56, 189, 248, 0.7);
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  }

  .cta-button {
    padding: 0.8rem 1.8rem;
    border-radius: 5px;
    background: linear-gradient(to right, #38bdf8, #818cf8);
    color: white;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
    transition: all 0.3s ease;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
  }

  .cta-features {
    display: flex;
    gap: 1.5rem;
  }

  .cta-feature {
    color: #94a3b8;
    font-size: 0.9rem;
  }

  /* CTA 3D Model */
  .cta-3d-model {
    width: 300px;
    height: 300px;
    position: relative;
    perspective: 1000px;
  }

  .floating-dashboard {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: floatDashboard 6s ease-in-out infinite;
  }

  @keyframes floatDashboard {
    0%, 100% { transform: translateY(0) rotateX(15deg) rotateY(-10deg); }
    50% { transform: translateY(-15px) rotateX(15deg) rotateY(-5deg); }
  }

  .dashboard-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 220px;
    height: 160px;
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(56, 189, 248, 0.7);
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
  }

  .dashboard-panel::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    width: 190px;
    height: 10px;
    background: rgba(56, 189, 248, 0.5);
    border-radius: 5px;
    box-shadow: 0 30px 0 rgba(129, 140, 248, 0.3), 0 60px 0 rgba(56, 189, 248, 0.4),
                0 90px 0 rgba(129, 140, 248, 0.3);
  }

  .data-point {
    position: absolute;
    width: 12px;
    height: 12px;
    background: linear-gradient(45deg, #38bdf8, #818cf8);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.6);
  }

  .data-point-1 {
    top: 30%;
    left: 30%;
    animation: pulsePoint 3s ease-in-out infinite;
  }

  .data-point-2 {
    top: 50%;
    right: 20%;
    animation: pulsePoint 3s ease-in-out infinite 1s;
  }

  .data-point-3 {
    bottom: 25%;
    left: 40%;
    animation: pulsePoint 3s ease-in-out infinite 2s;
  }

  @keyframes pulsePoint {
    0%, 100% { transform: scale(0.8); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  .connection-line {
    position: absolute;
    top: 30%;
    left: 30%;
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0));
    transform-origin: left center;
    transform: rotate(30deg);
  }

  .connection-line:nth-child(2) {
    top: 50%;
    right: 20%;
    width: 80px;
    background: linear-gradient(to left, rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0));
    transform: rotate(-45deg);
    transform-origin: right center;
  }

  /* Footer Section */
  .footer {
    padding: 4rem 5% 2rem;
    background: rgba(15, 23, 42, 0.8);
    border-top: 1px solid rgba(56, 189, 248, 0.1);
  }

  .footer-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .footer-column {
    min-width: 200px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .footer-logo-cube {
    width: 18px;
    height: 18px;
    transform-style: preserve-3d;
    animation: rotate 8s linear infinite;
    position: relative;
  }

  .f-logo-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #38bdf8, #818cf8);
    opacity: 0.85;
    border: 0.5px solid #e2e8f0;
    box-shadow: 0 0 5px rgba(56, 189, 248, 0.4);
  }

  .f-logo-face:nth-child(1) { transform: rotateX(90deg) translateZ(9px); }
  .f-logo-face:nth-child(2) { transform: rotateX(-90deg) translateZ(9px); }
  .f-logo-face:nth-child(3) { transform: translateZ(9px); }
  .f-logo-face:nth-child(4) { transform: rotateY(90deg) translateZ(9px); }
  .f-logo-face:nth-child(5) { transform: rotateY(-90deg) translateZ(9px); }
  .f-logo-face:nth-child(6) { transform: rotateY(180deg) translateZ(9px); }

  .footer-column p {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .social-links {
    display: flex;
    gap: 1rem;
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(56, 189, 248, 0.1);
    color: #f8fafc;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .social-link:hover {
    background: rgba(56, 189, 248, 0.3);
    transform: translateY(-3px);
  }

  .footer-column h4 {
    color: #f8fafc;
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
  }

  .footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-column ul li {
    margin-bottom: 0.7rem;
  }

  .footer-column ul li a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-column ul li a:hover {
    color: #38bdf8;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(56, 189, 248, 0.1);
    font-size: 0.9rem;
  }

  .footer-bottom p {
    color: #94a3b8;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .footer-links a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-links a:hover {
    color: #38bdf8;
  }

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .hero {
      flex-direction: column;
      padding: 3rem 5%;
      gap: 3rem;
    }

    .hero-content {
      max-width: 100%;
      text-align: center;
    }

    .hero-cta {
      justify-content: center;
    }

    .cta {
      flex-direction: column;
      gap: 3rem;
    }

    .cta-content {
      max-width: 100%;
      text-align: center;
      padding-right: 0;
    }
  }

  @media (max-width: 768px) {
    .header {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .nav-links {
      order: 3;
      width: 100%;
      justify-content: center;
      margin-top: 1rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .step {
      flex-direction: column;
      text-align: center;
    }

    .step-number {
      min-width: auto;
    }

    .testimonials-container {
      flex-direction: column;
      align-items: center;
    }

    .testimonial-card {
      width: 100%;
    }

    .cta-form {
      flex-direction: column;
    }

    .footer-columns {
      flex-direction: column;
      gap: 2.5rem;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .footer-links {
      flex-direction: column;
      gap: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    .hero h1 {
      font-size: 2.5rem;
    }

    .hero-cta {
      flex-direction: column;
    }

    .cta-features {
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
    }
  }
`;

export default WebMinerLanding;