import React from "react";

const features = [
  "Simulate multiple intersections",
  "Customize signal timing",
  "Real-time traffic visualization",
  "AI-powered suggestions",
];

const Features = () => {
  return (
    <div className=" mt-10 dark:bg-pink-500 rounded-lg shadow px-4 py-6 text-left">
      <h2 className="text-2xl font-bold text-black-400 mb-4">Traffic Light Simulation Features</h2>
      <ul className="list-disc list-outside pl-2 text-gray-400 dark:text-gray-700 space-y-2 ">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
};

export default Features;
