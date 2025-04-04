import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { getClosestSchedule } from "../../services/api.notification";

// Fixed avatar URL
const FIXED_AVATAR =
  "https://i.pinimg.com/736x/5f/91/41/5f91413c8a9e766a5139c6cfe5caa837.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [closestAppointment, setClosestAppointment] = useState(null);
  const [isNotificationAcknowledged, setIsNotificationAcknowledged] = useState(
    JSON.parse(localStorage.getItem("notificationAcknowledged") || "false") // Retrieve acknowledgment status
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Fetch the closest appointment date
  useEffect(() => {
    const fetchClosestDate = async () => {
      try {
        const response = await getClosestSchedule();
        const appointmentDate = new Date(response?.date);
        const now = new Date();
        const timeDifference = appointmentDate - now;

        // Check if the appointment is less than a day away
        if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
          setClosestAppointment(appointmentDate);
        } else {
          setClosestAppointment(null);
          setIsNotificationAcknowledged(true);
        }
      } catch (error) {
        console.error("Error fetching closest appointment:", error);
      }
    };

    fetchClosestDate();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNotificationClick = () => {
    setIsNotificationAcknowledged(true); // Disable the red dot
    localStorage.setItem("notificationAcknowledged", JSON.stringify(true)); // Persist status in local storage
    navigate("/viewprofile/calendar"); // Navigate to calendar
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
            {[
              { name: "Trang chủ", path: "/" },
              { name: "Gói thành viên", path: "/subscription" },
              { name: "Bảng sức khỏe chuẩn", path: "/whostandard" },
              { name: "Cộng đồng", path: "/community" },
            ].map((item) => (
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
                            onClick={() => navigate("/viewprofile")}
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
                  {/* <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={FIXED_AVATAR}
                      alt="User avatar"
                    />
                    <span className="hidden md:inline">{user.name}</span>
                  </button> */}
                </Dropdown>

                <div className="flex items-center space-x-4">
                  {/* Thông báo Button */}
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: closestAppointment ? (
                            <div
                              onClick={handleNotificationClick} // Handle click to disable dot and navigate
                              className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                              Bạn có lịch hẹn khám trong ngày{" "}
                              {closestAppointment.toLocaleString()}
                            </div>
                          ) : (
                            <div
                              onClick={() => navigate("/viewprofile/calendar")} // Navigate to calendar
                              className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                              Không có lịch hẹn trong ngày
                            </div>
                          ),
                          key: "notification",
                        },
                      ],
                    }}
                    trigger={["click"]}
                  >
                    <button className="relative px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <span className="relative">
                        {!isNotificationAcknowledged && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                        <BellOutlined className="text-gray-500 dark:text-gray-400" />
                      </span>
                      <span>Thông báo</span>
                    </button>
                  </Dropdown>

                  {/* Avatar Dropdown */}
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: (
                            <button
                              onClick={() => navigate("/viewprofile")}
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
                    <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={FIXED_AVATAR}
                        alt="User avatar"
                      />
                      <span className="hidden md:inline">{user.name}</span>
                    </button>
                  </Dropdown>
                </div>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
