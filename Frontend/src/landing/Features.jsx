import React from "react";

const Features = () => {
  const features = [
    {
      title: "Task Management",
      desc: "Create, update, delete, and organize tasks easily.",
    },

    {
      title: "Analytics Dashboard",
      desc: "Track completed, pending, and overdue tasks visually.",
    },

    {
      title: "Admin Panel",
      desc: "Manage all users and tasks with role-based access.",
    },

    {
      title: "Smart Filters",
      desc: "Search, sort, and filter tasks quickly.",
    },
  ];

  return (
    <section id="services" className="px-8 py-20 bg-gray-900 text-white">
      {/* TITLE */}
      <h2 className="text-4xl font-bold text-center mb-14">
        Powerful Features
      </h2>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-950 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

            <p className="text-gray-400 leading-7">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
