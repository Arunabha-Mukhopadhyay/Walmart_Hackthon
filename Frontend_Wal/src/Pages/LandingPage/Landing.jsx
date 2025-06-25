import React from "react";
import Demo from "../../assets/demo.jpeg"
import Footer from "../../components/Footer"
import MidPage from '../../components/MidPage'
import { Link } from "react-router-dom";

function Landing() {

  
  
  return (
    <>
    <div className="min-h-screen bg-[#e9f0ff] py-10 px-2">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 text-blue-700 font-semibold text-sm shadow-sm border border-blue-100">
            <span role="img" aria-label="rocket">
              🚀
            </span>
            Next-Gen Retail Management
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 leading-tight">
          Smart Walmart <span className="text-blue-600">Management</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-2xl text-center mb-8 max-w-2xl">
          Revolutionary inventory management and customer shopping experience.
          Streamline operations with AI-powered insights and optimize customer
          journeys.
        </p>

        <div className="flex gap-4 mb-12">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition flex items-center gap-2 text-lg text-center"
          >
            Get Started <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="w-full rounded-2xl overflow-hidden shadow-lg">
          <img
            src={Demo}
            alt="image not available"
            className="w-full object-cover"
          />
        </div>
      </div>

      <MidPage />
    </div>
      <Footer/>
  </>
  );
}

export default Landing;
