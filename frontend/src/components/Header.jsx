import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => setIsOpen(false);

  // Sections array: key is route (for router) and id (for scroll)
  const sections = [
    { name: "Home", id: "home", route: "/" },
    { name: "About", id: "about", route: "/about" },
    { name: "Features", id: "features", route: "/features" },
    { name: "Subscription", id: "Subscription", route: "/Subscription" },
    { name: "Demo", id: "demo", route: "/demo" },
    { name: "Team", id: "team", route: "/team" },
    { name: "Gallery", id: "gallery", route: "/gallery" },
    { name: "Contact", id: "contact", route: "/contact" },
    { name: "Signin", id: "signin", route: "/signin" },
    { name: "Signup", id: "signup", route: "/signup" },
  ];

  return (
    <header
      className="sticky top-0 z-30 font-sans shadow-lg"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `
          radial-gradient(circle at top right, rgba(70, 130, 180, 0.5), transparent 70%),
          radial-gradient(circle at bottom left, rgba(0, 191, 255, 0.3), transparent 70%),
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
          linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
        backdropFilter: "blur(60px)",
        backgroundSize: "100% 100%, 100% 100%, 50px 50px, 50px 50px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold text-blue-800"
          onClick={handleLinkClick}
        >
          <span>H₂Otronics</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-6 text-blue-800 md:flex">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.route}
              onClick={handleLinkClick}
              className="relative hover:text-blue-500 transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-blue-400 hover:after:w-full after:transition-all after:duration-300"
            >
              {section.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-800 focus:outline-none"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="px-6 py-4 space-y-3 text-blue-800 md:hidden">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.route}
              onClick={handleLinkClick}
              className="block px-4 py-2 transition-colors duration-300 rounded hover:bg-blue-100 hover:text-blue-600"
            >
              {section.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
