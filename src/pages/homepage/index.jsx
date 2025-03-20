import { useEffect, useState } from "react";
import { Modal, Button } from "antd"; // Import Antd Modal
import { useNavigate } from "react-router-dom"; // React Router navigation hook
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getClosestSchedule } from "../../services/api.notification";

const PregnancyHomepage = () => {
  const [darkMode] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [closestSchedule, setClosestSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate(); // Navigation hook from React Router

  useEffect(() => {
    handleNotification();
  }, []);

  // Function to fetch the closest schedule date
  const fetchClosestDate = async () => {
    try {
      const response = await getClosestSchedule();
      console.log("Closest Schedule:", response.date);
      return new Date(response.date);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return null; // Return null if there's an error
    }
  };

  // Function to compare the current date to the closest date and show the modal
  const compareDatesAndShowModal = (closestDate) => {
    if (!closestDate) return;

    const currentDate = new Date();
    const timeDifference = (closestDate - currentDate) / (1000 * 60 * 60 * 24); // Difference in days

    // Check if the user has already been notified today
    const lastNotified = localStorage.getItem("lastNotificationDate");
    const today = new Date().toDateString();

    if (timeDifference < 1 && lastNotified !== today) {
      console.log("The closest schedule is within 1 day!");
      setIsModalVisible(true); // Show Antd Modal
    }
  };

  // Combined function to handle both fetching and comparison
  const handleNotification = async () => {
    const closestDate = await fetchClosestDate();
    setClosestSchedule(closestDate);
    compareDatesAndShowModal(closestDate);
  };

  // Function to update the notification tracking in localStorage
  const updateNotificationDate = () => {
    const today = new Date().toDateString();
    localStorage.setItem("lastNotificationDate", today); // Update the localStorage variable
    setIsModalVisible(false); // Close the modal
  };

  // Function to navigate to the schedule page and update localStorage
  const navigateToSchedule = () => {
    updateNotificationDate();
    navigate("/viewprofile/calendar"); // Navigate to the schedule page
  };

  const healthTips = [
    {
      title: "Dinh dưỡng thai kì",
      content: "Ăn chế độ ăn cân bằng giàu axit folic và vitamin",
    },
    {
      title: "Thể dục",
      content:
        "Tập thể dục nhẹ nhàng thường xuyên như đi bộ và yoga trước sinh",
    },
    {
      title: "Nghỉ ngơi",
      content: "Đảm bảo ngủ đủ 8 giờ chất lượng mỗi đêm",
    },
    {
      title: "Cung cấp đủ nước",
      content: "Uống ít nhất 8-10 ly nước mỗi ngày",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      <Header />
      <header className="relative h-[600px] overflow-hidden">
        <img
          src="https://khoinguonsangtao.vn/wp-content/uploads/2022/10/hinh-anh-me-va-be.jpeg"
          alt="Pregnant woman"
          className="w-full h-full object-cover"
        />
      </header>

      {/* Antd Modal */}
      <Modal
        title="Lịch nhắc nhở"
        visible={isModalVisible}
        onCancel={updateNotificationDate} // Close the modal
        footer={[
          <Button key="close" onClick={updateNotificationDate}>
            Đóng
          </Button>,
          <Button key="schedule" type="primary" onClick={navigateToSchedule}>
            Tới lịch hẹn ngay
          </Button>,
        ]}
      >
        <p>Lịch hẹn gần nhất của bạn nằm trong 1 ngày!</p>
      </Modal>

      {/* Health Tips */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8">Sức khỏe và Thể thao</h3>
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

      <Footer />
    </div>
  );
};

export default PregnancyHomepage;
