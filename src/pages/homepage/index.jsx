import { useEffect, useState } from "react";
import { Modal, Button } from "antd"; // Import Antd Modal
import { useNavigate } from "react-router-dom"; // React Router navigation hook
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getClosestSchedule } from "../../services/api.notification";

const PregnancyHomepage = () => {
  const [darkMode] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate(); // Navigation hook from React Router

  const pregnancyStages = [
    {
      week: 1,
      description:
        "Ở tuần 1, mẹ vẫn chưa thật sự mang thai. Việc tính thời gian mang thai từ ngày đầu tiên của kỳ kinh cuối cùng cho phép bác sĩ ước tính ngày dự sinh một cách chính xác.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/1-3-weeks_1419791783-300x300.png",
    },
    {
      week: 2,
      description:
        "Vào tuần thứ 2, nếu thụ thai vào cuối tuần này, khả năng thành công rất cao. Bác sĩ sẽ tính thai kỳ của bạn từ ngày đầu tiên của kỳ kinh cuối.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/1-3-weeks_1419791783-300x300.png",
    },
    {
      week: 3,
      description:
        "Tuần thai thứ 3 đánh dấu thời điểm thụ thai bắt đầu. Quá trình thụ thai ở thời điểm này là khi hợp tử sẽ di chuyển vào tử cung và sẽ “làm tổ” ở đây với một tế bào cực nhỏ chính là túi phôi.",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/1-3-weeks_1419791783-300x300.png",
    },
    {
      week: 4,
      description:
        "Tuần 4 này chính là giai đoạn phôi thai tăng trưởng rất mãnh liệt để hình thành và phát triển những cơ quan, bộ phận của cơ thể. Đây cũng là thời điểm mẹ nên sắp xếp đi khám thai lần đầu. Chiều cao 0,2 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/4-weeks_727110898-300x300.png",
    },
    {
      week: 5,
      description:
        "Sự phát triển chính của tuần 5 này là mũi, miệng và tai. Một cái đầu quá khổ và những đốm sẫm màu nơi mắt và lỗ mũi của bé bắt đầu hình thành. Kích thước thai nhi chưa có sự khác biệt quá mức. Chiều cao 0,2 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/5-weeks_1482584441-300x300.png",
    },
    {
      week: 6,
      description:
        "Tuần thai thứ 6 là lúc mắt, mũi, miệng và tai của bé bắt đầu hình thành cùng một trái tim nhỏ đang đập với nhịp nhanh gần gấp đôi so với mẹ. Chiều cao 0,4 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/6-weeks_1482584444-300x300.png",
    },
    {
      week: 7,
      description:
        "Thai 7 tuần tuổi, những ngón tay, ngón chân có màng của bé đã bắt đầu xuất hiện và “đuôi” dần dần biến mất. Mẹ cũng cần tìm hiểu cách xoa dịu cơn ốm nghén. Chiều cao 1 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/7-weeks-1482584438-300x300.png",
    },
    {
      week: 8,
      description:
        "Ở tuần thai thứ 8, hình hài của bé đã phát triển tương đối đầy đủ và sẵn sàng để tăng cân trong những tháng tới. Mẹ nên tìm hiểu cần ăn gì để thai nhi tăng cân. Chiều cao 1,6 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/8-weeks_1482584405-300x300.png",
    },
    {
      week: 9,
      description:
        "Tuần thứ 9 là khởi đầu của giai đoạn bào thai, khi siêu âm, mẹ sẽ thấy các mô và cơ quan trong cơ thể của bé phát triển và trưởng thành nhanh chóng. Chiều cao 2,2 cm",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/9-weeks_293546375-300x300.png",
    },
    {
      week: 10,
      description:
        "Thai nhi 10 tuần tuổi phát triển gần đầy đủ các bộ phận như một người trưởng thành và vận động không ngừng với những cú đá, trườn, vặn mình và xoay người. Chiều cao 3 cm - Cân nặng 0,008 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/10-weeks_293546450-300x300.png",
    },
    {
      week: 11,
      description:
        "Ở tuần 11, khuôn mặt của bé bắt đầu hoàn chỉnh: Mắt đã di chuyển từ hai bên vào giữa khuôn mặt, tai đã ở đúng vị trí. Các tế bào thần kinh cũng được nhân lên rất nhanh. Mẹ lưu ý về vấn đề táo bón trong tuần thai này. Chiều cao 4,1 cm - Cân nặng 0,01 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/11-weeks_293546396-300x300.png",
    },
    {
      week: 12,
      description:
        "Thai 12 tuần đã có kích thước cơ thể tương ứng với phần đầu, các khớp thần kinh đang được hình thành như vũ bão, miệng của bé đã có phản xạ mút. Chiều cao 5,4 cm - Cân nặng 0,018 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/12-weeks_293546420-300x300.png",
    },
    {
      week: 13,
      description:
        "Bé đã lớn lên đáng kể cả về kích thước và các cơ quan bên trong khi có thể nheo mắt, cau mày, nhăn mặt, đi tiểu. Lông tơ siêu mịn bắt đầu phát triển, phủ khắp cơ thể bé. Chiều cao 7,4 cm - Cân nặng 0,025 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/13-weeks_293545115-300x300.png",
    },
    {
      week: 14,
      description:
        "Ở tuần này, chân của bé đã phát triển dài hơn cánh tay và bé có thể cử động tất cả các khớp và chân tay. Mặc dù mí mắt vẫn khép chặt, nhưng bé đã cảm nhận được ánh sáng. Mẹ đợi thêm thời gian nữa sẽ biết giới tính của thai nhi. Chiều cao 8,5 cm - Cân nặng 0,078 - 0,104 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/14-weeks_293546378-300x300.png",
    },
    {
      week: 15,
      description:
        "Tuần này, bé yêu đang trong quá trình hình thành và tập luyện rất nhiều phản xạ như tập hít thở, hình thành phản xạ thị giác. Chiều cao 10,1 cm - Cân nặng 0,099 - 0,132 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/15-weeks_727111789-300x300.png",
    },
    {
      week: 16,
      description:
        "Tuần này, chân của bé đã phát triển hơn, phần đầu ngẩng lên hơn so với trước. Các mảng da đầu đã bắt đầu cố định. Bé cũng đã bắt đầu hình thành các móng chân; và có thể đạp vào bụng mẹ. Chiều cao 11,6 cm - Cân nặng 0,124 - 0,166 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/16-weeks-1-300x300.png",
    },
    {
      week: 17,
      description:
        "Khi thai nhi 17 tuần tuổi, tim của bé do não điều chỉnh, vì vậy không còn đập ngẫu nhiên nữa. Tim bé sẽ đập từ 140-150 nhịp mỗi phút, nhanh gấp đôi so với người lớn. Chiều cao 12 cm - Cân nặng 0,155 - 0,207 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/17-weeks-1-300x300.png",
    },
    {
      week: 18,
      description:
        "Tuần này, tay chân của bé đã cân đối với nhau và với cơ thể. Thận tiếp tục tạo ra nước tiểu và tóc trên da đầu bắt đầu mọc. Một lớp phủ bảo vệ dạng sáp, gọi là vernix caseosa, đang hình thành trên làn da của bé. Chiều cao 14,2 cm - Cân nặng 0,192 - 0,255 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/18-weeks_293546339-300x300.png",
    },
    {
      week: 19,
      description:
        "Tuần này, bé bắt đầu biết nuốt vào nhiều nước ối hơn, điều này tốt cho hệ tiêu hóa của bé. Bé cũng thải ra phân su. Chiều cao 15,3 cm - Cân nặng 0,235 - 0,313 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/19-weeks_293545064-300x300.png",
    },
    {
      week: 20,
      description:
        "Tuần này, con có thể chuyển động nhẹ nhàng, biết đạp và huých. Lúc này, do túi thai vẫn rộng rãi nên thai nhi sẽ vặn mình và nhào lộn nhiều hơn. Chiều cao 25,6 cm - Cân nặng 0,286 - 0,380 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/20-weeks_1482584372-300x300.png",
    },
    {
      week: 21,
      description:
        "Tuần 21, bé đang bắt đầu có hình dáng của trẻ sơ sinh. Môi, mí mắt và lông mày của bé đã trở nên rõ ràng hơn và bé thậm chí phát triển những chồi răng tí hon bên dưới lợi. Bé cũng có thể bị nấc cụt. Chiều cao 26,7 cm - Cân nặng 0,345 - 0,458 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/21-weeks_293545046-300x300.png",
    },
    {
      week: 22,
      description:
        "Tuần thứ 22, mạch máu ở phổi của bé đang phát triển để chuẩn bị cho cho hoạt động thở. Tai của bé trở nên nhạy cảm hơn với âm thanh để chuẩn bị tiếp xúc với thế giới bên ngoài. Chiều cao 27,8 cm - Cân nặng 0,412 - 0,548 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/22-weeks_458875654-300x300.png",
    },
    {
      week: 23,
      description:
        "Ở tuần thứ 23, các cơ quan và xương của bé có thể nhìn thấy qua da, da vẫn mỏng và trong suốt nhưng sẽ sớm xảy ra sự thay đổi. Mẹ có thể bị mất ngủ, chuột rút hay ợ nóng. Chiều cao 28,9 cm - Cân nặng 0,489 - 0,650 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/23-weeks_293546480-300x300.png",
    },
    {
      week: 24,
      description:
        "Tuần này, bé không còn gầy nữa mà đã bắt đầu tích mỡ, vì thế, làn da nhăn nheo dần căng ra và bé dần giống trẻ sơ sinh hơn. Giai đoạn này mẹ cần chú ý đi xét nghiệm tiểu đường. Chiều cao 30 cm - Cân nặng 0,576 - 0,765 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/24-weeks_458875597-300x300.png",
    },
    {
      week: 25,
      description:
        "Ở tuần thứ 25, mạng lưới các dây thần kinh trong tai của bé phát triển tốt hơn và nhạy cảm hơn so với trước đây. Bé có thể nghe thấy giọng nói của ba mẹ. Chiều cao 34,6 cm - Cân nặng 0,673 - 0,894 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/25-weeks-458875555-300x300.png",
    },
    {
      week: 26,
      description:
        "Thai nhi 26 tuần tuổi có nhiều mô não và giác quan phát triển hơn, não của bé hoạt động rất tích cực. Bé ngủ và thức đều đặn, biết mở và nhắm mắt, thậm chí mút ngón tay. Chiều cao 35,6 cm - Cân nặng 0,78 - 1,038 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/26-weeks_1482584366-300x300.png",
    },
    {
      week: 27,
      description:
        "Thai nhi 27 tuần có thể nhìn thấy ánh sáng mờ mờ qua thành tử cung của mẹ. Bé có thể nhận ra giọng nói của bạn và chồng bạn, đồng thời bắt đầu nấc cụt. Chiều cao 36,6 cm - Cân nặng 0,898 - 1,196 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/27-weeks_293545130-300x300.png",
    },
    {
      week: 28,
      description:
        "Tuần thứ 28, đôi mắt của bé đang tiếp tục hoàn thiện. Các cơ bắp vững chãi hơn. Phổi cũng đã có thể hít thở được không khí. Đặc biệt, bộ não bé đang phát triển hàng triệu neuron thần kinh. Mẹ lưu ý về tiền sản giật trong giai đoạn này. Chiều cao 37,6 cm - Cân nặng 1,026 - 1,368 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/28-weeks-1-300x300.png",
    },
    {
      week: 29,
      description:
        "Tuần này, bé sẽ đạp nhiều, năng động hơn vì đã lớn hơn, mạnh hơn và phản ứng với tất cả các loại kích thích – chuyển động, âm thanh, ánh sáng cũng như thực phẩm mà mẹ ăn vào. Chiều cao 38,6 cm - Cân nặng 1,165 - 1,554 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/29-weeks_293545127-300x300.png",
    },
    {
      week: 30,
      description:
        "Bé đã có thể quay đầu từ bên này sang bên kia. Tay, chân và thân mình bắt đầu trở nên đầy đặn hơn do chất béo cần thiết đang bắt đầu tích tụ dưới da. Chiều cao 39,9 cm - Cân nặng 1,313 - 1,753 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/30-weeks_458875693-300x300.png",
    },
    {
      week: 31,
      description:
        "Bây giờ bé đã có móng chân, móng tay, tóc và lông tơ. Da của bé mềm và mịn do bé đang tròn trĩnh hơn. Bé đang phát triển 5 giác quan, ngủ nhiều và tập biểu hiện gương mặt. Chiều cao 41,1 cm - Cân nặng 1,470 - 1,964 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/31-weeks-1-300x300.png",
    },
    {
      week: 32,
      description:
        "Tuần 32, da bé không còn nhăn nheo và khung xương cũng cứng cáp hơn. Xương trên hộp sọ bé chưa chụm vào, có thể dịch chuyển và hơi chồng lên nhau để bé dễ chui lọt qua đường sinh khi chào đời. Mẹ có thể bắt đầu bị đau lưng. Chiều cao 42,4 cm - Cân nặng 1,635 - 2,187 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/32-weeks_458875585-300x300.png",
    },
    {
      week: 33,
      description:
        "Thai nhi hoạt động ngày càng giống em bé, mắt nhắm lại trong khi ngủ và mở khi thức. Thành tử cung ngày càng mỏng hơn, ánh sáng xuyên qua tử cung giúp bé phân biệt giữa ngày và đêm. Mẹ lưu ý về tình trạng giãn tĩnh mạch khi mang thai. Chiều cao 43,7 cm - Cân nặng 1,807 - 2,419 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/33-weeks_293545121-300x300.png",
    },
    {
      week: 34,
      description:
        "Khi thai nhi 34 tuần tuổi, lớp phủ sáp trắng bảo vệ da bé khỏi nước ối và cung cấp chất nhầy giúp bôi trơn để sinh nở đang dày lên, chuẩn bị cho quá trình chào đời. Chiều cao 45 cm - Cân nặng 1,985 - 2,659 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/34-weeks-1-300x300.png",
    },
    {
      week: 35,
      description:
        "Thận của bé đã phát triển đầy đủ và gan có thể xử lý một số chất thải. Hầu hết sự phát triển cơ bản về thể chất của thai nhi đã hoàn thiện. Bé sẽ dành vài tuần tới để tăng cân và dịch chuyển vị trí để chuẩn bị cho sinh nở. Chiều cao 46,2 cm - Cân nặng 2,167 - 2,904 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/35-weeks_293545061-300x300.png",
    },
    {
      week: 36,
      description:
        "Khi thai 36 tuần, xương sọ và hầu hết các xương khác, kể cả sụn của bé vẫn còn mềm. Nhiều cơ quan của bé đã hoàn thiện, chuẩn bị sẵn sàng cho cuộc sống ngoài bụng mẹ. Chiều cao 47,4 cm - Cân nặng 2,352 - 3,153 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/36-weeks-1-300x300.png",
    },
    {
      week: 37,
      description:
        "Lúc này, tử cung cũng chật chội nên thai nhi ít đạp hơn trước nhưng bạn vẫn cảm thấy được con ngọ nguậy. Nếu thấy bé quá im ắng trong giai đoạn này, bạn cần lập tức đến bác sĩ để kiểm tra. Chiều cao 48,6 cm - Cân nặng 2,537 - 3,403 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/37-weeks_293545148-300x300.png",
    },
    {
      week: 38,
      description:
        "Bé tiếp tục tích thêm mỡ dưới da để giúp kiểm soát thân nhiệt sau khi ra đời. Các bé trai thường nặng hơn bé gái một chút. Những lớp biểu bì bên ngoài đang được trút bỏ và thay thế bằng những lớp da mới bên dưới. Chiều cao 49,8 cm - Cân nặng 2,723 - 3,652 kg",
      image:
        "	https://cdn.hellobacsi.com/wp-content/uploads/2020/05/38-weeks_293546369-300x300.png",
    },
    {
      week: 39,
      description:
        "Tuần thứ 39, xương sọ của bé chưa khít lại, chúng có thể chồng lên nhau một chút để có thể chui lọt qua ngả âm đạo của mẹ. Mẹ cần lưu ý về các cơn gò tử cung. Chiều cao 50,7 cm - Cân nặng 2,905 - 3,897 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/39-weeks_293545079-300x300.png",
    },
    {
      week: 40,
      description:
        "Bé 40 tuần tuổi đã lớn nên không thể ở mãi trong bụng mẹ. Nếu bé vẫn không có dấu hiệu chào đời vào tuần tiếp theo thì bác sĩ có thể “kích sinh” để giữ an toàn cho hai mẹ con. Chiều cao 51,2 cm - Cân nặng 3,084 - 4,135 kg",
      image:
        "https://cdn.hellobacsi.com/wp-content/uploads/2020/05/40-weeks_293546468-300x300.png",
    },
  ];

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

      <section className="container mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold mb-8">
          Hành trình thai kỳ theo tuần
        </h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {pregnancyStages.map((stage) => (
            <div
              key={stage.week}
              className={`p-4 min-w-[150px] rounded-xl shadow-lg hover:transform hover:scale-105 transition-all cursor-pointer ${
                selectedWeek === stage.week
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-white dark:bg-gray-800"
              }`}
              onClick={() =>
                setSelectedWeek(stage.week === selectedWeek ? null : stage.week)
              }
            >
              <img
                //https://i.pinimg.com/736x/36/8d/4d/368d4dd9ec1b21434a26795fe293b82b.jpg
                src="https://i.pinimg.com/736x/21/f6/1a/21f61a0c25168b1ce5d87cc0c5786a06.jpg"
                alt="Fixed Image"
                className="w-full h-32 object-cover rounded-lg mb-2"
              />

              <h4 className="text-lg font-bold mb-1 text-center">
                Tuần {stage.week}
              </h4>
            </div>
          ))}
        </div>
        {selectedWeek && (
          <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h4 className="text-2xl font-bold mb-4">Tuần {selectedWeek}</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {
                    pregnancyStages.find((stage) => stage.week === selectedWeek)
                      .description
                  }
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center items-center">
                <img
                  src={
                    pregnancyStages.find((stage) => stage.week === selectedWeek)
                      .image
                  }
                  alt={`Week ${selectedWeek} details`}
                  className="max-w-full h-auto rounded-xl "
                />
              </div>
            </div>
          </div>
        )}
      </section>

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
