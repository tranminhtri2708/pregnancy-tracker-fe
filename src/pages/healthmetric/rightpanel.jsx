import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import ChildInfo from "./childinfo";
import GrowthChart from "./growgraph"; 
const { TabPane } = Tabs;

const RightPanel = ({ child }) => {
  if (!child) {
    return (
      <div className="text-gray-500 text-center">
        Vui lòng chọn một bé từ danh sách để xem thông tin chi tiết.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <Tabs defaultActiveKey="1">
        {/* First Tab: Child Info */}
        <TabPane tab="Chi Tiết Bé" key="1">
          <ChildInfo child={child} />
        </TabPane>

        {/* Second Tab: Growth Chart */}
        <TabPane tab="Biểu Đồ Tăng Trưởng" key="2">
          <GrowthChart childId={child.id} />
        </TabPane>
      </Tabs>
    </div>
  );
};

// PropTypes validation
RightPanel.propTypes = {
  child: PropTypes.object, // Child is either an object or null
};

export default RightPanel;
