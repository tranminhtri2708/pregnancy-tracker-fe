import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { BiStar } from "react-icons/bi";
import Header from "../../components/header";
import { getSubscriptionPlan } from "../../services/api.subscription";
import { toast } from "react-toastify";

const MembershipPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getSubscriptionPlan();

        // Chỉ hiển thị các gói đang hoạt động
        const activePackages = data.filter((plan) => plan.isActive);

        // Đánh dấu gói cao cấp nhất (giá cao nhất) là "popular"
        if (activePackages.length > 0) {
          const sortedPackages = [...activePackages].sort(
            (a, b) => b.price - a.price
          );
          const enhancedPackages = activePackages.map((pkg) => ({
            ...pkg,
            popular: pkg.id === sortedPackages[0].id,
          }));
          setPackages(enhancedPackages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu gói thành viên:", error);
        toast.error("Không thể tải danh sách gói thành viên");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Hàm chuyển đổi thời hạn từ số tháng thành chuỗi hiển thị
  const formatDuration = (months) => {
    if (months === 0) return "Vĩnh viễn";
    if (months === 1) return "1 tháng";
    if (months >= 120) return "Vĩnh viễn"; // Giả sử 10 năm trở lên là "vĩnh viễn"
    return `${months} tháng`;
  };

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

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            Hiện tại chưa có gói thành viên nào.
          </p>
        </div>
      ) : (
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
                  <h3 className="text-2xl font-bold text-gray-900">
                    {`Gói ${pkg.name}`}
                  </h3>
                  <p className="mt-2 text-gray-500">{pkg.description}</p>
                </div>
                <div className="text-center mb-8">
                  <p className="text-5xl font-extrabold text-gray-900">
                    {pkg.price}
                  </p>
                  <span className="text-gray-500">
                    {formatDuration(pkg.durationInMonths)}
                  </span>
                </div>
                {pkg.feature && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {pkg.feature.split(",").map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <FiCheck className="text-green-500 mr-2" />
                          <span className="text-gray-700">
                            {feature.trim()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className={`w-full bg-gradient-to-r ${color} text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition duration-300`}
                >
                  Trải nghiệm ngay
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MembershipPackages;
