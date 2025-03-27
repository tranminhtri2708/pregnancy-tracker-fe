import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

// Fixed avatar URL
const FIXED_AVATAR =
  "https://i.pinimg.com/736x/5f/91/41/5f91413c8a9e766a5139c6cfe5caa837.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Gói thành viên", path: "/subscription" },
<<<<<<< HEAD
    { name: "Công cụ sức khỏe", path: "/baby" },
=======
    { name: "Công cụ sức khỏe", path: "/health-check" },
    { name: "Cộng đồng", path: "/community" },
>>>>>>> dc5ccdcd5df9eed96538f8a2de20dfb6ef296171
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

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

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: (
                          <button
                            onClick={() => navigate("/profile")}
                            className="block text-left w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            Xem hồ sơ
                          </button>
                        ),
                        key: "profile",
                      },
                      {
                        label: (
                          <button
                            onClick={handleLogout}
                            className="block text-left w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            Đăng xuất
                          </button>
                        ),
                        key: "logout",
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <button
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                    onClick={() => navigate("/viewprofile")}
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={FIXED_AVATAR}
                      alt="User avatar"
                    />
                    <span className="hidden md:inline">{user.name}</span>
                  </button>
                </Dropdown>
              </>
            ) : (
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
                >
                  Đăng kí
                </button>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover't:blue-400"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
