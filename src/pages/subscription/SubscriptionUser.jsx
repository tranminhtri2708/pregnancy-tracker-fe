import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { BiStar } from "react-icons/bi";
import Header from "../../components/header";
import { getSubscriptionPlan } from "../../services/api.subscription";
import { createSubscription } from "../../services/api.subscriptionuser";
import { toast } from "react-toastify";
import { createOrder } from "../../services/api.order";
import { createPayment } from "../../services/api.payment";
import { getAllSubscriptionPlanUser } from "../../services/api.subscriptionuser";

const MembershipPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyAble, setBuyAble] = useState(false);

  function getFormattedCurrentTime() {
    const now = new Date();
    return now.toISOString(); // Use ISO format for API input
  }

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionPlan();

      const activePackages = data.filter((plan) => plan.isActive);
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
  const handleBuyAbleStatus = (currentSubscriptions) => {
    if (!currentSubscriptions) {
      // If currentSubscriptions is null, set buyAble to true and return
      setBuyAble(true);
      return;
    }

    if (currentSubscriptions.paymentStatus === "Pending") {
      // If paymentStatus is Pending, set buyAble to true
      setBuyAble(true);
      return;
    }

    if (
      currentSubscriptions.paymentStatus === "Paid" &&
      currentSubscriptions.status === "Active"
    ) {
      // If paymentStatus is Paid and status is Active, set buyAble to false
      setBuyAble(false);
      return;
    }

    // Default case (if none of the above conditions match)
    setBuyAble(true);
  };

  const fetchUserSubscription = async () => {
    try {
      const data = await getAllSubscriptionPlanUser();
      console.log("987", data);
      const currentSubscriptions = data[0];
      console.log("432", currentSubscriptions);
      handleBuyAbleStatus(currentSubscriptions);
      console.log("123", buyAble);
    } catch (error) {
      toast.error("Không thể tải danh sách gói thành viên");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      toast.success("Thanh toán thành công!");
    } else if (status === "failure") {
      toast.error("Thanh toán bị lỗi! Xin hãy thử lại");
    }
    fetchUserSubscription();
    fetchPackages();
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  }

  const formatDuration = (months) => {
    if (months === 0) return "Vĩnh viễn";
    if (months === 1) return "1 tháng";
    if (months >= 120) return "Vĩnh viễn";
    return `${months} tháng`;
  };

  function formatPackageName(name) {
    const nameMapping = {
      0: "Bronze",
      1: "Silver",
      2: "Gold",
    };
    return nameMapping[name] || "unknown";
  }

  // Handle "Trải nghiệm ngay" button click
  const handleSubscription = async (pkgId) => {
    if (!buyAble) {
      console.log("123", buyAble);
      toast.error("Gói của bạn hiện tại vẫn đang có hiệu lực");
      return;
    }
    const startDate = getFormattedCurrentTime();
    const data = {
      planId: pkgId,
      startDate: startDate,
    };

    try {
      // Disable the button while processing
      setLoading(true);

      // ng dung đăng ký gói thành viên
      const result = await createSubscription(data);
      console.log("Subscription created:", result);

      // tạo order
      const result2 = await createOrder(result);
      console.log("Order created:", result2);

      // tạo payment
      const finalResult = await createPayment(result2.id);
      console.log("Payment created:", finalResult);

      // Check for valid finalResult and redirect
      if (finalResult) {
        // Redirect user to the payment URL
        window.location.href = finalResult;
      } else {
        toast.error("Unable to create payment.");
      }
    } catch (error) {
      console.error("Error during subscription process:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // Re-enable the button after processing is complete
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-16 px-6">
      <Header />
      <div className="max-w-6xl mx-auto text-center mb-16 mt-20">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Các gói phí thành viên
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
                    {`Gói ${formatPackageName(pkg.name)}`}
                  </h3>
                  <p className="mt-2 text-gray-500">{pkg.description}</p>
                </div>
                <div className="text-center mb-8">
                  <p className="text-5xl font-extrabold text-gray-900">
                    {formatPrice(pkg.price)}
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
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${color} text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleSubscription(pkg.id)}
                >
                  {loading ? "Processing..." : "Trải nghiệm ngay"}
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
