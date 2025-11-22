import React from "react";

const articles = [
  { title: "NO Take Time Extra", img: "/images/article1.png" },
  { title: "Instant Traffic Clear", img: "/images/article2.png" },
  { title: "Smart Traffic Management", img: "/images/article3.png" },
];

const Articles = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10 p-6">
      {articles.map((a, i) => (
        <div key={i} className=" border-2 border-pink-600  p-4 rounded shadow hover:scale-105 transition-all">
          <img src={a.img} alt={a.title} className="w-full h-40 object-cover rounded mb-2"/>
          <h3 className="font-semibold text-black-400">{a.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Articles;
