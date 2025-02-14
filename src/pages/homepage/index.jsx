// import React, { useState } from "react";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Header from "../../components/header";
import Footer from "../../components/footer";

const PregnancyHomepage = () => {
  const [darkMode, setDarkMode] = useState(false);
  // const [currentWeek, setCurrentWeek] = useState(1);

  const pregnancyStages = [
    { week: 1, description: "Conception and early development" },
    { week: 12, description: "First trimester milestone" },
    { week: 24, description: "Second trimester development" },
    { week: 36, description: "Final preparation for birth" },
  ];

  const healthTips = [
    {
      title: "Nutrition",
      content: "Eat a balanced diet rich in folic acid and vitamins",
    },
    {
      title: "Exercise",
      content: "Regular gentle exercise like walking and prenatal yoga",
    },
    { title: "Rest", content: "Ensure 8 hours of quality sleep each night" },
    {
      title: "Hydration",
      content: "Drink at least 8-10 glasses of water daily",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <Header />
      <header className="relative h-[600px] overflow-hidden">
        <img
          src="https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/06/28/Pictures/newborns-effort-facilities-needed-pregnant-provide-basic_78e8dd6e-7ab6-11e8-8d5f-3f0c905295d2.jpg"
          alt="Pregnant woman"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/06/28/Pictures/newborns-effort-facilities-needed-pregnant-provide-basic_78e8dd6e-7ab6-11e8-8d5f-3f0c905295d2.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-50 dark:to-gray-900">
          <nav className="container mx-auto p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">BabyJourney</h1>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              </button>
              {/* <NavItem icon={<FaCalendar />} text="Subscription Pregnancy" />
              <NavItem icon={<FaHeartbeat />} text="Health Tips" />
              <NavItem icon={<FaBook />} text="Resources" />
              <NavItem icon={<FaUserFriends />} text="Community" /> */}
              {/* Add Sign In and Sign Up buttons */}
            </div>
          </nav>
          <div className="container mx-auto px-6 pt-32">
            <h2 className="text-5xl font-bold mb-4">
              Your Journey, Your Pregnancy Companion
            </h2>
            <p className="text-xl max-w-2xl">
              Supporting you through every beautiful moment of your pregnancy
              journey.
            </p>
          </div>
        </div>
      </header>

      {/* Pregnancy Timeline */}
      <section className="container mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold mb-8">Pregnancy Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {pregnancyStages.map((stage) => (
            <div
              key={stage.week}
              className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:transform hover:scale-105 transition-all"
            >
              <h4 className="text-xl font-bold mb-2">Week {stage.week}</h4>
              <p>{stage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tips */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8">Health & Wellness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthTips.map((tip, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-rose-100 dark:bg-gray-700 hover:shadow-lg transition-all"
              >
                <h4 className="text-xl font-bold mb-2">{tip.title}</h4>
                <p>{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Due Date Calculator */}
      <section className="container mx-auto py-16 px-6">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Due Date Calculator</h3>
          <div className="space-y-4">
            <input
              type="date"
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            />
            <button className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors">
              Calculate Due Date
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© 2024 BabyJourney. All rights reserved.</p>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
};

export default PregnancyHomepage;
