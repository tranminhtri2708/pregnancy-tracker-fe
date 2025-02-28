// import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaBaby,
  FaBook,
  FaUsers,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-pink-50 text-gray-600 pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-pink-600 flex items-center gap-2">
              <FaBaby className="text-pink-500" />
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaHeart className="text-pink-400" size={12} />
                  Giai đoạn mang thai
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaBook className="text-pink-400" size={12} />
                  Tài nguyên y tế
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaHeart className="text-pink-400" size={12} />
                  Hướng dẫn dinh dưỡng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaUsers className="text-pink-400" size={12} />
                  Cộng đồng hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-pink-600">
              Thông tin chúng tôi
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaPhone className="text-pink-400" />
                <span>24/7 Helpline: 18004565</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-pink-400" />
                <a
                  href="mailto:support@pregnancy.care"
                  className="hover:text-pink-500 transition-colors duration-300"
                >
                  support@momly.care
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-400" />
                <span>Số 29 đường Liễu Giai, Quận Ba Đình, Hà Nội</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-pink-600">Thông tin</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300"
                >
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300"
                >
                  Chính sách quyền riêng tư
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300"
                >
                  Tiêu chuẩn cộng đông
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-500 transition-colors duration-300"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-pink-600">
              Kết nối với chúng tôi
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-pink-400 hover:text-pink-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-pink-400 hover:text-pink-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>

              <a
                href="#"
                className="text-pink-400 hover:text-pink-600 transition-colors duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* <div className="mt-12 pt-8 border-t border-pink-200">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Pregnancy Care. All rights reserved.
            <span className="block sm:inline sm:ml-2">
              Made with{" "}
              <FaHeart className="inline-block text-pink-500" size={12} /> for
              expecting mothers.
            </span>
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
