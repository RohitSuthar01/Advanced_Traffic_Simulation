import React from "react";

import Articles from "../Articles/Articles";
import TrafficLightArticle from "../Rules/TrafficLightArticle ";
import Features from "../Features/Features";
import Footer from "../Footer/Footer";

const Home = () => {
  return (
    <div className=" h-full text-center mt-10 bg-cover bg-pink-400">
      <h1 className="text-4xl font-bold text-black-400 mb-4">
        Delivering Superior Traffic Light Simulation
      </h1>
      <p className="text-lg text-gray-400 dark:text-gray-700 mb-6">
        Experience real-time smart traffic control visualization. Customize and simulate your own intersection.
      </p>
      <div className="flex justify-center gap-4 mb-6">
        <a href="/index" target="_blank"
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-black"
        >
          Get Started
        </a>


        <button className="bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-full">Learn More</button>
      </div>


      <Articles />
      <TrafficLightArticle />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
