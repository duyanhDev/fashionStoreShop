import { Popover, Steps } from "antd";
import "./OderStaus.css";
import { useParams } from "react-router-dom";
import { OrderStatusOneProduct } from "../../service/Oder";
import { useEffect, useState } from "react";
import moment from "moment";
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const OderStatus = () => {
  const param = useParams();
  const [orderStatus, SetOrderStatus] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const fetchAPIOrderStatus = async () => {
    try {
      const res = await OrderStatusOneProduct(param.id);

      if (res && res.data && res.data.EC === 0) {
        SetOrderStatus(res.data.data.orderStatus);
        setCreatedAt(res.data.data.createdAt);
      }
    } catch (error) {}
  };
  const description = moment(createdAt).format("DD/MM/YYYY");

  useEffect(() => {
    fetchAPIOrderStatus();
  }, param.id);
  return (
    <div className="m-auto " style={{ width: "1300px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15666.024280146616!2d106.64748009060058!3d11.000605852809585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1732372972043!5m2!1svi!2s"
        width="1300"
        height="600"
        className="flex items-center"
      ></iframe>
      <div className="mt-10">
        <div className="ml-6 car_amiton">
          <div className="car_oder ">
            <img
              src="https://mcdn.coolmate.me/image/October2024/mceclip2_42.png"
              alt="trunks"
            />
          </div>
        </div>
        <Steps
          current={orderStatus === "Processing" ? 1 : 2}
          progressDot={customDot}
          items={[
            {
              title: "Đã vận chuyển",
              description: moment(createdAt).format("DD/MM/YYYY"), // Ngày ban đầu
            },
            {
              title: "Đang chờ giao hàng",
              description: moment(createdAt)
                .add(2, "days")
                .format("DD/MM/YYYY"), // Cộng thêm 2 ngày
            },
            {
              title: "Đã giao hàng thành công",
              description: moment(createdAt)
                .add(4, "days")
                .format("DD/MM/YYYY"), // Ví dụ cộng 4 ngày
            },
          ]}
        />
      </div>
    </div>
  );
};

export default OderStatus;
