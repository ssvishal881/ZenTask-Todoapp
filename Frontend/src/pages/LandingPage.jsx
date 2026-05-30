import React from "react";
import Navbar from "../landing/Navbar";
import Herosection from "../landing/Herosection";
import Features from "../landing/Features";
import Footer from "../landing/Footer";
import About from "../landing/About";
import toast from "react-hot-toast";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Herosection />
      <About />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
