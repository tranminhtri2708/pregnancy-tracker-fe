import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  FaBaby,
  FaEye,
  FaEyeSlash,
  FaHeartbeat,
  FaQuestionCircle,
  FaRegCalendarCheck,
  FaSave,
  FaSignOutAlt,
  FaUserCircle,
  FaUserFriends,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
const faqData = [
  {
    question: "MomCare là gì?",
    answer:
      "MomCare là một nền tảng chăm sóc sức khỏe trực tuyến. Chúng tôi cung cấp thông tin, công cụ và dịch vụ hỗ trợ sức khỏe - tất cả nội dung đều đã được tham vấn chuyên môn. Sứ mệnh của chúng tôi là giúp bạn và người thân lựa chọn các quyết định sáng suốt, từ đó sống khỏe mạnh và hạnh phúc hơn. Hello Bacsi là công ty tư nhân thuộc sở hữu của Hello Health Group Pte. Ltd. và hoạt động tại Việt Nam.",
  },
  {
    question: "Vì sao tôi nên đăng ký tài khoản?",
    answer:
      "Đăng ký tài khoản thành viên ở Hello Bacsi đem lại cho bạn nhiều lợi ích hơn như giúp bạn lưu trữ các thông tin sức khỏe cá nhân, đặt lịch khám với bác sĩ, tham gia các cộng đồng sức khỏe của Hello Bacsi cũng như hỗ trợ MomCare cá nhân hóa trải nghiệm sử dụng nền tảng của bạn.",
  },
  {
    question: "Đăng ký ở MomCare có mất phí không?",
    answer:
      "Miễn phí và luôn luôn miễn phí! Tuy nhiên, một số dịch vụ giúp bạn kết nối với bên thứ ba có thể tính phí nhất định cho bạn. Để biết thêm thông tin, vui lòng xem thêm tại chính sách Quảng cáo & Tài trợ của chúng tôi.",
  },
  {
    question:
      "Nếu tôi có thắc mắc liên quan đến sức khỏe, làm thế nào để đặt câu hỏi?",
    answer:
      "MomCare có chính sách về quyền riêng tư và bảo mật rất nghiêm ngặt, giúp bảo vệ mọi thông tin mà bạn cung cấp cho MomCare. Để biết thêm thông tin, vui lòng truy cập trang Chính sách Quyền riêng tư của chúng tôi. Chúng tôi không sử dụng thông tin cá nhân của bạn mà không được bạn cho phép trước đó.",
  },
  {
    question: "Tôi quan ngại về quyền riêng tư của mình?",
    answer:
      "MomCare có chính sách về quyền riêng tư và bảo mật rất nghiêm ngặt, giúp bảo vệ mọi thông tin mà bạn cung cấp cho Hello Bacsi. Để biết thêm thông tin, vui lòng truy cập trang Chính sách Quyền riêng tư của chúng tôi. Chúng tôi không sử dụng thông tin cá nhân của bạn mà không được bạn cho phép trước đó.",
  },
  {
    question: "Tôi muốn xóa tài khoản và hủy đăng ký.",
    answer:
      "Bạn có thể xóa tài khoản của mình bất kỳ lúc nào bằng cách đăng nhập và đến trang Hồ sơ. Nếu muốn hủy đăng ký nhận thông tin qua email, bạn có thể truy cập vào đường link ở cuối mỗi email mà chúng tôi gửi đến bạn.",
  },
  {
    question: "Nếu tôi xóa tài khoản, dữ liệu của tôi sẽ ra sao?",
    answer:
      "Một khi đã xóa tài khoản, toàn bộ dữ liệu cá nhân của bạn cũng sẽ được xóa. Chúng tôi có thể lưu trữ các dữ liệu này trong vòng tối đa 90 ngày sau khi xóa tài khoản, phòng trường hợp bạn muốn đăng ký lại.",
  },
];
const PregnancyProfile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubSection, setSelectedSubSection] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedSubSection(null);
  }, [selectedSection]);

  {
    /*Các thông tin về Chi tiết thông tin của tôi */
  }
  const [personalInfo, setPersonalInfo] = useState({
    fullname: "Nguyễn Thị Hồng Ngọc",
    address: "TPHCM",
    email: "nguyenngocdh04@gmail.com",
    birth: "21-11-2004",
    phone: "0916693077",
    profileImage: "https://nguoinoitieng.tv/images/nnt/105/0/bibl.jpg",
  });
  {
    /*Chi tiết thông tin về sức khỏe */
  }
  const handleNavigate = (path) => {
    setSelectedSection(path);
    navigate(`/viewprofile/${path}`);
  };
  const handleRedirect = (path) => {
    setSelectedSection(path);
    navigate(`/`);
  };
  const [healthMetrics, setHealthMetrics] = useState({
    weight: "65kg",
    bloodPressure: "120/80",
    lastCheckup: "2024-01-15",
  });

  const [medicalHistory, setMedicalHistory] = useState({
    conditions: ["None"],
    medications: ["Prenatal Vitamins"],
    allergies: ["Penicillin"],
    vaccinations: ["Flu Shot", "Tdap"],
  });

  {
    /*hai cái này là của trợ giúp */
  }
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  {
    /*Phần về thiết lập tài khoản */
  }
  {
    /*đặt lại mật khẩu */
  }
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const validatePassword = (password) => {
    if (password.length < 8) return "Độ dài tối thiểu là 8 ký tự";
    if (!/[A-Z]/.test(password)) return "Phải có ít nhất 1 chữ hoa";
    if (!/[a-z]/.test(password)) return "Phải có ít nhất 1 chữ thường";
    if (!/[0-9]/.test(password)) return "Phải có ít nhất 1 số";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Phải có ít nhất 1 ký tự đặc biệt";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };

    if (name === "password") {
      newErrors.password = validatePassword(value);
    }

    if (name === "confirmPassword") {
      newErrors.confirmPassword =
        value !== formData.password ? "Mật khẩu xác nhận không khớp" : "";
    }

    setErrors(newErrors);
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />

      <main className="flex flex-grow p-4 md:p-8 mt-[80px]">
        {/*do header fixed cứng nên này tôi phải đẩy nó xuống 80px nếu không nó bị header bị che  */}
        <div className="w-1/4 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col items-center">
            <img
              src={personalInfo.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
            />
            <h2 className="text-xl font-bold mt-4">{personalInfo.fullname}</h2>
            <p className="text-gray-600"> {personalInfo.email}</p>
          </div>
          <div className="mt-6 space-y-4">
            {/*Nút xem hồ sơ của tôi */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "personal" ? "bg-pink-200" : "bg-gray-100"
              }`}
              onClick={() => handleNavigate("personal")}
            >
              <FaUserCircle className="text-pink-500 text-2xl" />
              <span>Hồ sơ của tôi</span>
            </button>
            {/*Nút xem sức khỏe thai nhi của từng user */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "health" ? "bg-pink-200" : "bg-gray-100"
              }`}
              onClick={() => setSelectedSection("health")}
            >
              <FaHeartbeat className="text-red-500  text-2xl" />
              <span>Sức khỏe</span>
            </button>
            {/*Nút đã lưu thể hiện các bài viết đã lưu */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "save" ? "bg-pink-200" : "bg-gray-100"
              }`}
              onClick={() => setSelectedSection("save")}
            >
              <FaSave className="text-green-500 text-2xl" />
              <span>Bài viết đã lưu</span>
            </button>
            {/*Nút Đã tham gia thể hiện các cộng đồng đã tham gia */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "communicate"
                  ? "bg-pink-200"
                  : "bg-gray-100"
              }`}
              onClick={() => setSelectedSection("communicate")}
            >
              <FaUserFriends className="text-purple-500 text-2xl" />
              <span>Đã tham gia</span>
            </button>
            {/*Thông tin về thai */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "numberbaby" ? "bg-pink-200" : "bg-gray-100"
              }`}
              onClick={() => handleNavigate("numberbaby")}
            >
              <FaBaby className="text-pink-500 text-2xl" />
              <span>Thông tin bé</span>
            </button>
            {/*Nút lịch sư khám bệnh ở đây sẽ thể hiện các lịch hẹn khám sắp tới */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "calendar" ? "bg-pink-200" : "bg-gray-100"
              }`}
              onClick={() => {
                setSelectedSection("calendar");
                handleNavigate("calendar");
              }}
            >
              <FaRegCalendarCheck className="text-green-500 text-2xl" />
              <span>Lịch sử lịch hẹn</span>
            </button>
            {/*Nút thiết lâp tài khoản ở đây có hai cái là mật khẩu và vô hiệu hóa tài khoản */}
            <div>
              {/* Nút Thiết lập tài khoản */}
              <button
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg ${
                  selectedSection === "account" ? "bg-pink-200" : "bg-gray-100"
                }`}
                onClick={() =>
                  setSelectedSection(
                    selectedSection === "account" ? null : "account"
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <FaGear className="text-gray-500 text-2xl" />
                  <span>Thiết lập tài khoản</span>
                </div>
                {selectedSection === "account" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>

              {/* Danh sách con của Thiết lập tài khoản */}
              {selectedSection === "account" && (
                <div className="mt-2 space-y-1 pl-6">
                  {/*Nút đặt lại mật khẩu trong nút thiết lập tài khoản */}
                  <button
                    className={`w-full flex items-center space-x-2 text-left px-3 py-2 rounded-md transition ${
                      selectedSubSection === "password"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSubSection("password")}
                  >
                    <span className="text-blue-500">•</span>
                    <span>Mật khẩu</span>
                  </button>
                  {/*Nút vô hiệu hóa tài khoản trong nút thiết lập tài khoản */}
                  <button
                    className={`w-full flex items-center space-x-2 text-left px-3 py-2 rounded-md transition ${
                      selectedSubSection === "deactivate"
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSubSection("deactivate")}
                  >
                    <span className="text-blue-500">•</span>
                    <span>Vô hiệu hóa tài khoản</span>
                  </button>
                </div>
              )}
            </div>

            {/*Nút trợ giúp */}
            <button
              className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
                selectedSection === "help" ? "bg-pink-200" : "bg-gray-100"
              }`}
              onClick={() => setSelectedSection("help")}
            >
              <FaQuestionCircle className="text-blue-500 text-2xl" />
              <span>Trợ giúp</span>
            </button>
            {/*Nút đăng xuất tài khoản */}
            <div>
              {/* Nút đăng xuất */}
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 rounded-md hover:bg-gray-100 transition"
              >
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
              {/* Modal đăng xuất */}
              {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold text-center">
                      Đăng xuất?
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                      Bạn có chắc chắn muốn đăng xuất?
                    </p>

                    {/* Nút hành động */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition w-1/2 mr-2"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          console.log("Đăng xuất...");
                          localStorage.removeItem("token");
                          localStorage.removeItem("expiration");
                          localStorage.clear();
                          dispatch(logout());
                          setIsOpen(false);
                          handleRedirect();
                        }}
                        className="px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-100 transition w-1/2 ml-2"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*Ngăn cách các nút và thông tin hiênhj bên phải */}
        <div className="w-3/4 p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {selectedSection === "personal" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Hồ sơ của tôi
              </h2>
              <Outlet />
            </div>
          )}

          {selectedSection === "health" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Sức khỏe của tôi
              </h2>
              <p>Weight: {healthMetrics.weight}</p>
              <p>Blood Pressure: {healthMetrics.bloodPressure}</p>
              <p>Last Checkup: {healthMetrics.lastCheckup}</p>
            </div>
          )}
          {/*Các thông tin về số lượng em bé */}
          {selectedSection === "numberbaby" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Thông tin bé
              </h2>
              <Outlet />
            </div>
          )}
          {selectedSection === "communicate" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Sức khỏe của tôi
              </h2>
              <p>Weight: {healthMetrics.weight}</p>
              <p>Blood Pressure: {healthMetrics.bloodPressure}</p>
              <p>Last Checkup: {healthMetrics.lastCheckup}</p>
            </div>
          )}
          {selectedSubSection === "password" && (
            <div>
              <h2 className="text-lg font-semibold">Đặt mật khẩu</h2>

              {/* Mật khẩu mới */}
              <div className="relative mt-4">
                <label className="block text-sm font-medium">Mật khẩu</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="relative mt-4">
                <label className="block text-sm font-medium">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận lại mật khẩu mới"
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Nút tạo mật khẩu */}
              <button
                className="mt-4 w-full px-4 py-2 text-white rounded-md transition-all duration-300 
                        disabled:bg-gray-300 bg-blue-500 hover:bg-blue-600"
                disabled={
                  errors.password ||
                  errors.confirmPassword ||
                  !formData.password ||
                  !formData.confirmPassword
                }
              >
                Tạo mật khẩu
              </button>
            </div>
          )}

          {selectedSubSection === "deactivate" && (
            <div className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Vô hiệu hóa tài khoản
              </h2>
              <p className="text-gray-600 mt-2">
                Chúng tôi rất tiếc vì tài khoản của bạn đã bị vô hiệu hóa. Sứ
                mệnh của chúng tôi là mang đến hành trình chăm sóc sức khỏe tiện
                lợi dành cho bạn. Chúng tôi luôn nỗ lực hết mình để hỗ trợ bạn,
                mong rằng chúng tôi sẽ có cơ hội xử lý các sự cố hoặc vấn đề khó
                khăn bạn đang gặp phải với tài khoản của mình. Sau khi bị vô
                hiệu hóa tài khoản tại MomCare, bạn sẽ có 30 ngày để khôi phục
                lại tài khoản bằng cách đăng nhập lại. Nếu bạn không thực hiện
                thao tác này, tài khoản của bạn với các dữ liệu, thông tin sức
                khỏe và lịch sử đặt khám sẽ không còn có thể truy cập hay khôi
                phục được nữa, đồng nghĩa với việc tài khoản sẽ bị xóa vĩnh
                viễn.
              </p>

              <label className="block mt-4 text-gray-700 font-medium">
                Vì sao bạn muốn vô hiệu hóa tài khoản?
              </label>
              <select className="mt-2 w-full border rounded-md p-2">
                <option value="">Chọn lý do</option>
                <option value="privacy">Lo ngại về quyền riêng tư</option>
                <option value="not-useful">Ứng dụng không hữu ích</option>
                <option value="other">Lý do khác</option>
              </select>

              <button
                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => {
                  if (
                    window.confirm(
                      "Bạn có chắc chắn muốn vô hiệu hóa tài khoản không?"
                    )
                  ) {
                    alert("Tài khoản của bạn đã bị vô hiệu hóa!");
                  }
                }}
              >
                Vô hiệu hóa
              </button>
            </div>
          )}
          {selectedSection === "calendar" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Sức khỏe của tôi
              </h2>
              <p>Weight: {healthMetrics.weight}</p>
              <p>Blood Pressure: {healthMetrics.bloodPressure}</p>
              <p>Last Checkup: {healthMetrics.lastCheckup}</p>
            </div>
          )}
          {selectedSection === "help" && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Trợ giúp</h2>

              {faqData.map((item, index) => (
                <div key={index} className="border-b">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center py-4 text-left text-gray-900 font-semibold hover:bg-gray-100 px-3"
                  >
                    {item.question}
                    {openIndex === index ? (
                      <FaChevronUp className="text-gray-600" />
                    ) : (
                      <FaChevronDown className="text-gray-600" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="p-4 text-gray-700 bg-gray-50">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedSection === "logout" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Sức khỏe của tôi
              </h2>
              <p>Weight: {healthMetrics.weight}</p>
              <p>Blood Pressure: {healthMetrics.bloodPressure}</p>
              <p>Last Checkup: {healthMetrics.lastCheckup}</p>
            </div>
          )}

          {selectedSection === "save" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Medical History
              </h2>
              <p>Conditions: {medicalHistory.conditions.join(", ")}</p>
              <p>Medications: {medicalHistory.medications.join(", ")}</p>
              <p>Allergies: {medicalHistory.allergies.join(", ")}</p>
              <p>Vaccinations: {medicalHistory.vaccinations.join(", ")}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PregnancyProfile;
