import { Link } from "react-router-dom";
import { useEffect } from "react";
import bg10 from '../assets/bg10.png';

// Google Font - Playfair Display
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Add custom animation styles to the document
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 1s ease-out forwards;
  }

  .delay-200 {
    animation-delay: 0.2s;
  }

  .delay-300 {
    animation-delay: 0.3s;
  }

  .playfair {
    font-family: 'Playfair Display', serif;
  }
`;
document.head.appendChild(style);

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="w-full h-screen relative bg-center bg-cover"
      style={{ backgroundImage: `url(${bg10})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white playfair font-bold mb-6 drop-shadow-lg animate-fade-in">
          Welcome to YEN Restaurant
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mb-10 animate-fade-in delay-200">
          Indulge in gourmet dishes crafted with passion, in an ambiance tailored for your taste.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-6 justify-center animate-fade-in delay-300">
          <Link to="/signin">
            <button className="px-8 py-3 text-sm sm:text-base bg-[#e93b92] text-white rounded-full font-semibold tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#d12e7e] shadow-lg">
              Sign In Now
            </button>
          </Link>

          <Link to="/about">
            <button className="px-8 py-3 text-sm sm:text-base border border-white text-white rounded-full font-semibold tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-[#e93b92] hover:text-[#e93b92] shadow-lg">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
