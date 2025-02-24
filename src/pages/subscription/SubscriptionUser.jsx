import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const MembershipPackages = () => {
  const [packages] = useState([
    {
      id: 1,
      name: "Bronze",
      price: "$10",
      period: "/year",
      description: "Hoàn hảo cho các cá nhân bắt đầu cuộc hành trình của họ",
      features: [
        {
          text: "Tạo lịch nhắc nhở",
          included: true,
          tooltip:
            "Mẹ bầu có thể ghi chú các lịch, khám thai, xét nghiệm cần làm cho lần khám kế tiếp và ứng dụng MomCare sẽ giúp bạn ghi nhớ và nhắc nhở",
        },
        {
          text: "Tương tác với cộng đồng ",
          included: true,
          tooltip:
            "Mẹ bầu có quyền tham gia các nhóm cộng đồng, được đăng bài và chia sẻ các kinh nghiệm ở đó",
        },
        {
          text: "Theo dõi tốc độ tăng trưởng của thai nhi",
          included: false,
          tooltip:
            "MomCare sẽ giúp bạn tính toán các chỉ số sau mỗi lần khám và đưa ra nhắc nhở để bạn có thể biết và theo dõi được bé yêu của mình",
        },
        {
          text: "Theo dõi thai kì qua biểu đồ",
          included: false,
          tooltip:
            "Mẹ bầu sẽ nhận được biểu đồ sau mỗi lần nhập số liệu thai nhi , MomCare sẽ giúp bạn đánh giá và hiển thị các chỉ số xuyên suốt từ đâu thai kì để bạn có thể theo dõi và nhận được cảnh báo khi có bất thường từ chúng tôi",
        },
        {
          text: "Chia sẻ biểu đồ tăng trưởng",
          included: false,
          tooltip:
            "Mẹ bầu có thể chia sẻ biểu đồ lên cộng đồng để chia sẻ và hỏi đáp các thắc mắc với mọi người",
        },
      ],
      gradient: "from-[#FFB6C1] to-[#FFC0CB]",
    },
    {
      id: 2,
      name: "Silver",
      price: "$15",
      period: "/year",
      description: "Lý tưởng cho các bà mẹ muốn có một thai kỳ khỏe mạnh.",
      features: [
        {
          text: "Tạo lịch nhắc nhở",
          included: true,
          tooltip:
            "Mẹ bầu có thể ghi chú các lịch, khám thai, xét nghiệm cần làm cho lần khám kế tiếp và ứng dụng MomCare sẽ giúp bạn ghi nhớ và nhắc nhở",
        },
        {
          text: "Tương tác với cộng đồng ",
          included: true,
          tooltip:
            "Mẹ bầu có quyền tham gia các nhóm cộng đồng, được đăng bài và chia sẻ các kinh nghiệm ở đó",
        },
        {
          text: "Theo dõi tốc độ tăng trưởng của thai nhi",
          included: true,
          tooltip:
            "MomCare sẽ giúp bạn tính toán các chỉ số sau mỗi lần khám và đưa ra nhắc nhở để bạn có thể biết và theo dõi được bé yêu của mình",
        },
        {
          text: "Theo dõi thai kì qua biểu đồ",
          included: false,
          tooltip:
            "Mẹ bầu sẽ nhận được biểu đồ sau mỗi lần nhập số liệu thai nhi , MomCare sẽ giúp bạn đánh giá và hiển thị các chỉ số xuyên suốt từ đâu thai kì để bạn có thể theo dõi và nhận được cảnh báo khi có bất thường từ chúng tôi",
        },
        {
          text: "Chia sẻ biểu đồ tăng trưởng",
          included: false,
          tooltip:
            "Mẹ bầu có thể chia sẻ biểu đồ lên cộng đồng để chia sẻ và hỏi đáp các thắc mắc với mọi người",
        },
      ],
      gradient: "from-[#FFC0CB] to-[#FFD1DC]",
    },
    {
      id: 3,
      name: "Gold",
      price: "$20",
      period: "/year",
      description:
        "Lý tưởng cho các bà mẹ tương lai đang tìm kiếm sự hỗ trợ và hướng dẫn cao cấp.",
      features: [
        {
          text: "Tạo lịch nhắc nhở",
          included: true,
          tooltip:
            "Mẹ bầu có thể ghi chú các lịch, khám thai, xét nghiệm cần làm cho lần khám kế tiếp và ứng dụng MomCare sẽ giúp bạn ghi nhớ và nhắc nhở",
        },
        {
          text: "Tương tác với cộng đồng ",
          included: true,
          tooltip:
            "Mẹ bầu có quyền tham gia các nhóm cộng đồng, được đăng bài và chia sẻ các kinh nghiệm ở đó",
        },
        {
          text: "Theo dõi tốc độ tăng trưởng của thai nhi",
          included: true,
          tooltip:
            "MomCare sẽ giúp bạn tính toán các chỉ số sau mỗi lần khám và đưa ra nhắc nhở để bạn có thể biết và theo dõi được bé yêu của mình",
        },
        {
          text: "Theo dõi thai kì qua biểu đồ",
          included: true,
          tooltip:
            "Mẹ bầu sẽ nhận được biểu đồ sau mỗi lần nhập số liệu thai nhi , MomCare sẽ giúp bạn đánh giá và hiển thị các chỉ số xuyên suốt từ đâu thai kì để bạn có thể theo dõi và nhận được cảnh báo khi có bất thường từ chúng tôi",
        },
        {
          text: "Chia sẻ biểu đồ tăng trưởng",
          included: true,
          tooltip:
            "Mẹ bầu có thể chia sẻ biểu đồ lên cộng đồng để chia sẻ và hỏi đáp các thắc mắc với mọi người",
        },
      ],
      gradient: "from-[#FFD1DC] to-[#FF69B4]",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hãy chọn gói thành viên phù hợp với bạn
          </h1>
          <p className="text-xl text-gray-600">
            Hãy cùng MomCare trải nghiệm một thai kì thật tuyệt vời!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className={`bg-gradient-to-r ${pkg.gradient} p-6`}>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {pkg.name}
                </h2>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    {pkg.price}
                  </span>
                  <span className="text-xl text-white opacity-80">
                    {pkg.period}
                  </span>
                </div>
                <p className="mt-4 text-white opacity-90">{pkg.description}</p>
              </div>

              <div className="p-6">
                <ul className="space-y-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center relative">
                      {feature.included ? (
                        <FaCheck className="text-green-500 w-5 h-5 mr-3" />
                      ) : (
                        <FaTimes className="text-red-500 w-5 h-5 mr-3" />
                      )}
                      <span className="text-gray-700">{feature.text}</span>
                      <FiInfo
                        data-tooltip-id={`tooltip-${pkg.id}-${index}`}
                        className="ml-2 text-gray-400 cursor-pointer"
                      />
                      <Tooltip
                        id={`tooltip-${pkg.id}-${index}`}
                        place="top"
                        className="max-w-[200px] whitespace-normal break-words"
                      >
                        {feature.tooltip}
                      </Tooltip>
                    </li>
                  ))}
                </ul>

                <button
                  className="mt-8 w-full bg-[#FF69B4] text-white py-3 px-6 rounded-lg font-semibold
                    transform transition-all duration-300 hover:bg-[#FF1493] hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF69B4]"
                >
                  Bắt đầu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPackages;
