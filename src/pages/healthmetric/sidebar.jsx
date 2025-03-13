import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Spin } from "antd";
import api from "../../config/axios";
import RightPanel from "./rightpanel";// Import the RightPanel component

const Baby = () => {
  const [childrens, setChildrens] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const getUserID = async () => {
    try {
      const response = await api.get("UserAccount/GetUserId");
      const userId =
        response?.data?.result?.userId || localStorage.getItem("userId");

      if (userId) {
        localStorage.setItem("userId", userId);
        setUserId(userId);
        return userId;
      } else {
        throw new Error("Cannot retrieve user ID");
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchChildren = async (userIdParam) => {
    try {
      setLoading(true);
      const response = await api.get("Children/GetAllChildren");
      const data = response?.data?.result || [];

      const filteredChildren = data.filter(
        (child) =>
          child.accountId === Number(userIdParam) ||
          child.userId === Number(userIdParam)
      );

      setChildrens(filteredChildren);
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userId = await getUserID();
      if (userId) {
        fetchChildren(userId);
      }
    };

    init();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <div className="flex flex-grow p-4 md:p-8">
        {/* Left side: List of children */}
        <div className="w-1/6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Danh sách bé
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <Spin tip="Đang tải danh sách..." />
            </div>
          ) : (
            <ul className="space-y-4">
              {childrens.map((child) => (
                <li key={child.id}>
                  <button
                    className={`w-full flex items-center space-x-4 text-left px-4 py-2 rounded-lg ${
                      selectedChild?.id === child.id
                        ? "bg-pink-200"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedChild(child)}
                  >
                    <FaUserCircle className="text-pink-500 text-2xl" />
                    <span>{child.fullName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right side: Child details */}
        <div className="w-3/4 ml-6">
          <RightPanel child={selectedChild} />
        </div>
      </div>
    </div>
  );
};

export default Baby;
