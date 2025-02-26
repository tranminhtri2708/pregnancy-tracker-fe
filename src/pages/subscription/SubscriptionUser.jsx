import React from "react";
import { FiCheck } from "react-icons/fi";
import { BiStar } from "react-icons/bi";
import Header from "../../components/header";

const MembershipPackages = () => {
  // các dữ liệu cứng
  const packages = [
    {
      id: 1,
      name: "Bronze",
      price: 29,
      duration: "3 tháng",
      description: "Trải nghiệm ngay! Hoàn hảo để bắt đầu hành trình của bạn.",
    },
    {
      id: 2,
      name: "Silver",
      price: 59,
      duration: "10 tháng",
      description: "Gói linh hoạt, đồng hành cùng bạn trong suốt thai kỳ.",
    },
    {
      id: 3,
      name: "Gold",
      price: 99,
      duration: "Vĩnh viễn",
      description: "Đồng hành mãi mãi – Một lần đăng ký, hưởng lợi ích mãi mãi",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-16 px-6">
      <Header />
      <div className="max-w-6xl mx-auto text-center mb-16 mt-20">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Các gói thành viên
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          Chọn gói thành viên phù hợp để đồng hành cùng bạn trên hành trình sức
          khỏe!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {packages.map((pkg, index) => {
          const colors = [
            "from-pink-400 to-rose-500",
            "from-rose-400 to-fuchsia-500",
            "from-fuchsia-400 to-purple-500",
          ];
          const color = colors[index % colors.length];

          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl bg-white shadow-2xl p-8 border-t-8 border-transparent hover:border-opacity-100 hover:border-gradient-to-r ${color} transition-all duration-300 hover:scale-105`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 right-4 bg-yellow-400 text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center shadow-lg">
                  <BiStar className="mr-1" /> Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="mt-2 text-gray-500">{pkg.description}</p>
              </div>

              <div className="text-center mb-8">
                <p className="text-5xl font-extrabold text-gray-900">
                  ${pkg.price}
                </p>
                <span className="text-gray-500">{pkg.duration}</span>
              </div>

              <button
                className={`w-full bg-gradient-to-r ${color} text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition duration-300`}
              >
                Trải nghiệm ngay
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipPackages;
