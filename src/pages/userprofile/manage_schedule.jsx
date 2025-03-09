import React, { useState, useEffect } from "react";
import { Bell, Calendar, Plus, Trash2, AlertCircle, Edit } from "lucide-react";
import { toast } from "react-toastify";
import {
  createSchedule,
  getSchedule,
  deleteSchedule,
  updateSchedule,
} from "../../services/api.schedule";

const ManageSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    time: "09:00",
    description: "",
    notify: true,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Month names in Vietnamese
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Day names in Vietnamese
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Helper functions for calendar
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date as DD/MM/YYYY for display
  const formatDisplayDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date as ISO string for API
  const formatApiDate = (date, timeString) => {
    if (!date) return "";
    const [hours, minutes] = timeString.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return newDate.toISOString();
  };

  // Parse API date to Date object
  const parseApiDate = (dateString) => {
    try {
      return new Date(dateString);
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return new Date();
    }
  };

  // Select a date to create appointment
  const onSelectDate = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
    setIsEditMode(false);
    setSelectedAppointment(null);
    setFormValues({
      time: "09:00",
      description: "",
      notify: true,
    });
  };

  // Handle editing appointment
  const handleEditAppointment = (appointment, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedAppointment(appointment);
    setSelectedDate(appointment.date);
    setFormValues({
      time: appointment.time,
      description: appointment.description,
      notify: appointment.notify,
    });
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Reset form when closing modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedAppointment(null);
  };

  // Fetch appointments from API
  const fetchAppointments = async () => {
    setIsLoading(true);

    try {
      const response = await getSchedule();

      if (!response || !response.result) {
        toast.error("Không nhận được dữ liệu từ máy chủ");
        return;
      }

      // Format the dates from API response to our appointment format
      const formattedAppointments = response.result.map((item) => {
        const dateObj = parseApiDate(item.appointmentDate);
        return {
          id: item.id,
          date: dateObj,
          time: `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          description: item.description,
          notify: item.isNoti, // Fixed property name to match API
          appointmentDate: item.appointmentDate,
        };
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Không thể tải lịch khám. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Save or update appointment
  const handleSaveAppointment = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.warning("Vui lòng chọn ngày khám");
      return;
    }

    if (!formValues.description.trim()) {
      toast.warning("Vui lòng nhập nội dung khám!");
      return;
    }

    setIsLoading(true);

    try {
      // Format the data according to the backend requirements
      const appointmentData = {
        description: formValues.description,
        appointmentDate: formatApiDate(selectedDate, formValues.time),
        isNoti: formValues.notify, // Fixed property name to match API
      };

      let response;

      if (isEditMode && selectedAppointment) {
        // Update existing appointment
        response = await updateSchedule({
          id: selectedAppointment.id,
          scheduleData: appointmentData,
        });

        if (!response || !response.isSuccess) {
          throw new Error(response?.errorMessage || "Lỗi không xác định");
        }

        toast.success("Đã cập nhật lịch khám thành công");
      } else {
        // Create new appointment
        response = await createSchedule(appointmentData);

        if (!response || !response.isSuccess) {
          throw new Error(response?.errorMessage || "Lỗi không xác định");
        }

        toast.success("Đã tạo lịch khám thành công");
      }

      setIsModalVisible(false);
      setIsEditMode(false);
      setSelectedAppointment(null);

      // Refresh appointments from server to ensure consistency
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error(
        error.message || "Không thể lưu lịch khám. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment || !selectedAppointment.id) {
      toast.warning("Không thể xóa lịch khám. Vui lòng thử lại.");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await deleteSchedule(selectedAppointment.id);

      if (!response || !response.isSuccess) {
        throw new Error(response?.errorMessage || "Lỗi không xác định");
      }

      toast.success("Đã xóa lịch khám thành công");
      setIsDeleteModalVisible(false);
      setSelectedAppointment(null);

      // Refresh appointments from server
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(
        error.message || "Không thể xóa lịch khám. Vui lòng thử lại sau."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Show delete confirmation modal
  const confirmDeleteAppointment = (appointment, e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    setSelectedAppointment(appointment);
    setIsDeleteModalVisible(true);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Check if a date has appointments
  const hasAppointment = (date) => {
    return appointments.some(
      (appointment) =>
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear()
    );
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(
      (appointment) =>
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear()
    );
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 p-1 border border-gray-200"
        ></div>
      );
    }

    // Today's date for highlighting current day
    const today = new Date();

    // Add cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateAppointments = getAppointmentsForDate(date);
      const isToday =
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          className={`h-16 p-1 border border-gray-200 
            ${hasAppointment(date) ? "bg-blue-50" : ""} 
            ${isToday ? "border-blue-500 border-2" : ""}
            hover:bg-gray-100 cursor-pointer relative`}
          onClick={() => onSelectDate(date)}
        >
          <div className={`font-medium ${isToday ? "text-blue-600" : ""}`}>
            {day}
          </div>
          {dateAppointments.slice(0, 2).map((appointment) => (
            <div
              key={appointment.id}
              className="text-xs mt-1 truncate text-blue-600 group flex justify-between items-center"
            >
              <span className="truncate">
                {appointment.time} - {appointment.description.substring(0, 8)}
                {appointment.description.length > 8 ? "..." : ""}
                {appointment.notify && (
                  <Bell className="inline-block w-3 h-3 ml-1 text-green-600" />
                )}
              </span>
              <div className="opacity-0 group-hover:opacity-100 flex">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-1"
                  onClick={(e) => handleEditAppointment(appointment, e)}
                  aria-label="Chỉnh sửa lịch khám"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => confirmDeleteAppointment(appointment, e)}
                  aria-label="Xóa lịch khám"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {dateAppointments.length > 2 && (
            <div className="text-xs text-gray-500">
              +{dateAppointments.length - 2} nữa
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Get upcoming appointments sorted by date
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter((a) => {
        const appointmentDateTime = new Date(a.date);
        appointmentDateTime.setHours(
          parseInt(a.time.split(":")[0], 10),
          parseInt(a.time.split(":")[1], 10)
        );
        return appointmentDateTime >= now;
      })
      .sort((a, b) => {
        const dateTimeA = new Date(a.date);
        dateTimeA.setHours(
          parseInt(a.time.split(":")[0], 10),
          parseInt(a.time.split(":")[1], 10)
        );

        const dateTimeB = new Date(b.date);
        dateTimeB.setHours(
          parseInt(b.time.split(":")[0], 10),
          parseInt(b.time.split(":")[1], 10)
        );

        return dateTimeA - dateTimeB;
      })
      .slice(0, 5); // Show more upcoming appointments
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isLoading && appointments.length === 0 && (
        <div className="text-center py-4 text-gray-600">
          <div className="animate-pulse">Đang tải lịch khám...</div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="text-lg font-semibold">
              Lịch khám thai định kỳ
            </span>
          </div>
          <button
            onClick={() => onSelectDate(new Date())}
            className="px-3 py-1 bg-white text-pink-600 rounded-md hover:bg-blue-50 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Lịch mới
          </button>
        </div>

        <div className="p-4">
          <p className="mb-4 text-gray-600">
            Chọn ngày trên lịch để đặt lịch khám thai. Bạn sẽ nhận được thông
            báo trước khi đến ngày khám.
          </p>

          {/* Month navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              aria-label="Tháng trước"
            >
              &lt;
            </button>
            <div className="text-lg font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={nextMonth}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              aria-label="Tháng sau"
            >
              &gt;
            </button>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {dayNames.map((day) => (
              <div
                key={day}
                className="bg-gray-100 text-center py-2 font-medium"
              >
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* Create/Edit Appointment Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Chỉnh sửa lịch khám thai" : "Đặt lịch khám thai"}
            </h2>

            <form onSubmit={handleSaveAppointment}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Ngày khám</label>
                <input
                  type="text"
                  value={formatDisplayDate(selectedDate)}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Thời gian</label>
                <input
                  type="time"
                  name="time"
                  value={formValues.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Nội dung khám
                </label>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Khám thai 3 tháng, siêu âm..."
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notify"
                    checked={formValues.notify}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-green-600" />
                    Nhận thông báo trước khi đến lịch khám
                  </div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 mr-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    <>
                      {isEditMode ? (
                        <>
                          <Edit className="w-4 h-4 mr-1" />
                          Cập nhật
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Tạo lịch
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalVisible && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Xác nhận xóa lịch khám</h2>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="mb-2">Bạn có chắc chắn muốn xóa lịch khám này?</p>
              <div className="text-sm text-gray-600">
                <div>
                  <strong>Ngày khám:</strong>{" "}
                  {formatDisplayDate(selectedAppointment.date)}
                </div>
                <div>
                  <strong>Thời gian:</strong> {selectedAppointment.time}
                </div>
                <div>
                  <strong>Nội dung:</strong> {selectedAppointment.description}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalVisible(false)}
                disabled={isDeleting}
                className="px-4 py-2 mr-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteAppointment}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa lịch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-green-600 text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Lịch khám sắp tới</span>
        </div>

        <div className="p-4">
          {getUpcomingAppointments().length > 0 ? (
            getUpcomingAppointments().map((appointment) => (
              <div
                key={appointment.id}
                className="border-b pb-3 mb-3 last:border-0 group"
              >
                <div className="flex justify-between">
                  <div className="font-semibold">
                    {formatDisplayDate(appointment.date)} - {appointment.time}
                  </div>
                  <div className="flex items-center">
                    {appointment.notify ? (
                      <div className="flex items-center text-green-600 mr-3">
                        <Bell className="w-4 h-4 mr-1" />
                        <span className="text-sm">Có thông báo</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400 mr-3">
                        <Bell className="w-4 h-4 mr-1" />
                        <span className="text-sm">Không thông báo</span>
                      </div>
                    )}
                    <div className="flex">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleEditAppointment(appointment, e)}
                        aria-label="Chỉnh sửa lịch khám"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) =>
                          confirmDeleteAppointment(appointment, e)
                        }
                        aria-label="Xóa lịch khám"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-gray-600">
                  {appointment.description}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 flex flex-col items-center">
              <Calendar className="w-10 h-10 mb-2 text-gray-300" />
              <p>Không có lịch khám nào sắp tới</p>
              <button
                onClick={() => onSelectDate(new Date())}
                className="mt-3 px-4 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tạo lịch mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
