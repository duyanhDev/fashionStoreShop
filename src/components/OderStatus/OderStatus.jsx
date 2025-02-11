import { Popover, Steps } from "antd";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./OderStaus.css";
import { useParams } from "react-router-dom";
import { OrderStatusOneProduct } from "../../service/Oder";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import geoData from "./../../geojs.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZHV5YW5oMjIyMTEiLCJhIjoiY202ejNxZGx1MDBvZDJrb2ltNHkwb296dSJ9.Pr5aXlEATUZwujalLMA8Rg";

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
  const [data, setData] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const fetchAPIOrderStatus = async () => {
    try {
      const res = await OrderStatusOneProduct(param.id);

      if (res && res.data && res.data.EC === 0) {
        SetOrderStatus(res.data.data.orderStatus);
        setCreatedAt(res.data.data.createdAt);
        setData(res.data.data);
      }
    } catch (error) {}
  };
  // const description = moment(createdAt).format("DD/MM/YYYY");

  useEffect(() => {
    fetchAPIOrderStatus();
  }, [param.id]);
  console.log(data);

  useEffect(() => {
    if (map.current) return; // Không khởi tạo lại map nếu đã tồn tại

    // Tạo bản đồ
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.1072, 15.7767], // Tâm bản đồ tại Việt Nam
      zoom: 5.5,
    });

    // Giới hạn khu vực bản đồ trong phạm vi Việt Nam
    const bounds = [
      [102.14441, 8.17966], // Góc dưới trái
      [109.46477, 23.39272], // Góc trên phải
    ];
    map.current.setMaxBounds(bounds);

    // Thêm nguồn GeoJSON và hiển thị các tỉnh/thành phố của Việt Nam
    map.current.on("load", () => {
      map.current.addSource("vietnam", {
        type: "geojson",
        data: geoData, // Tệp GeoJSON chứa 63 tỉnh thành
      });

      // Thêm layer hiển thị các tỉnh/thành phố
      map.current.addLayer({
        id: "vietnam-layer",
        type: "fill",
        source: "vietnam",
        paint: {
          "fill-color": "#088", // Màu nền của vùng
          "fill-opacity": 0.6, // Độ mờ của vùng
        },
      });

      // Viền cho các vùng
      map.current.addLayer({
        id: "vietnam-boundaries",
        type: "line",
        source: "vietnam",
        paint: {
          "line-color": "#000",
          "line-width": 1.5,
        },
      });

      // Hiển thị thông tin khi di chuột vào từng vùng
      map.current.on("mouseenter", "vietnam-layer", (e) => {
        map.current.getCanvas().style.cursor = "pointer"; // Thay đổi con trỏ chuột
        const properties = e.features[0].properties;
        const provinceName = properties["NAME_1"] || "Không xác định"; // Tên tỉnh/thành

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<h3>${provinceName}</h3>`)
          .addTo(map.current);
      });

      // Xóa popup khi rời khỏi vùng
      map.current.on("mouseleave", "vietnam-layer", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, []);

  return (
    <div className="m-auto " style={{ width: "1300px" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
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

      <div className="flex justify-center mt-4 full_order">
        <div className="flex-1 text-center ">
          <h1>ĐỊA CHỈ NHẬN HÀNG</h1>
          <p>Người nhận : {data.username}</p>
          <p>Số điện thoại : (+84) {data.phone}</p>
          <p>
            Địa chỉ : {data.shippingAddress?.fullAddress || "Không có địa chỉ"}
          </p>
        </div>
        <div className="flex-1">2</div>
      </div>
    </div>
  );
};

export default OderStatus;
