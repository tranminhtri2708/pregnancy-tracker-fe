import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Subscription", path: "/subscription" },
    { name: "Health Check", path: "/health-check" },
  ];

  const communityItems = [
    {
      label: "Chuẩn bị mang thai",
      key: "1",
      path: "/community/PregnancyPrep",
    },
    { label: "Mẹ bầu", key: "2", path: "/community/Pregnancy" },
  ].map((item) => ({
    label: (
      <button
        onClick={() => navigate(item.path)}
        className="block text-left w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        {item.label}
      </button>
    ),
    key: item.key,
  }));

  return (
    <header className="bg-white dark:bg-gray-900 fixed w-full top-0 left-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1
              className="text-2xl font-bold text-pink-600 dark:text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              MomCare
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}

            {/* Dropdown Community */}
            <Dropdown
              menu={{ items: communityItems }}
              trigger={["click"]}
              getPopupContainer={(trigger) => trigger.parentElement} // Fix dropdown bị nhảy khi cuộn
            >
              <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                <Space>
                  Community
                  <DownOutlined />
                </Space>
              </button>
            </Dropdown>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Authentication */}
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="User avatar"
                />
                <span className="hidden md:inline">John Doe</span>
              </button>
            ) : (
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </button>
              ))}

              {/* Community Dropdown trên mobile */}
              <Dropdown menu={{ items: communityItems }} trigger={["click"]}>
                <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium">
                  <Space>
                    Community
                    <DownOutlined />
                  </Space>
                </button>
              </Dropdown>

              {!isLoggedIn && (
                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
