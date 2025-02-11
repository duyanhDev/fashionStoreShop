import { useEffect, useState } from "react";
import "./Ranking.css";
import {
  DollarOutlined,
  CrownOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { UserAuth } from "../../service/Auth";

const Ranking = () => {
  const [users, setUsers] = useState([]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0VNĐ";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "VNĐ";
  };

  // Hàm lấy màu cho rank
  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-500"; // Top 1 - Vàng
      case 1:
        return "bg-gray-300"; // Top 2 - Bạc
      case 2:
        return "bg-amber-600"; // Top 3 - Đồng
      default:
        return "bg-blue-100";
    }
  };

  // Hàm lấy icon cho rank
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <CrownOutlined className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <CrownOutlined className="h-6 w-6 text-gray-400" />;
      case 2:
        return <CrownOutlined className="h-6 w-6 text-amber-600" />;
      default:
        return <TrophyOutlined className="h-6 w-6 text-blue-400" />;
    }
  };

  const FetechDataUsers = async () => {
    let res = await UserAuth();
    if (res && res.data.EC === 0) {
      setUsers(res.data.data);
    }
  };

  useEffect(() => {
    FetechDataUsers();
  }, []);

  // Sắp xếp users theo totalPrice
  const sortRankingTop = [...users].sort((a, b) => b.totalPrice - a.totalPrice);

  return (
    <div className="main_ranking max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Bảng Xếp Hạng Chi Tiêu
        </h2>
        <DollarOutlined className="text-blue-500 dollar text-2xl" />
      </div>
      <div className="space-y-4 top_ranking">
        {sortRankingTop.map((user, index) => (
          <div
            key={user._id}
            className="flex items-center p-4 bg-white border rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full mr-4">
              {getRankIcon(index)}
            </div>

            <div className="flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className={`w-12 h-12 rounded-full border-2 ${getRankColor(
                  index
                )}`}
              />
            </div>

            <div className="ml-4 flex-grow">
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>Tổng chi tiêu: {formatPrice(user.totalPrice)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(
                  index
                )} text-white font-bold`}
              >
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
