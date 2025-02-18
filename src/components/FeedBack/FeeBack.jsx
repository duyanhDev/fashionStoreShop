import { Modal, Flex, Rate, Input, message } from "antd";

import { useState } from "react";

import "./FeedBack.css";
import { feeckacksProductsAPI } from "../../service/ApiProduct";

const FeedBack = ({ modal2Open, setModal2Open, data, userid }) => {
  const desc = [1, 2, 3, 4, 5];
  const [value, setValue] = useState(0);
  const [content, setContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const formatPrice = (price) => {
    // Nếu price là chuỗi, chuyển đổi nó thành một số
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^\d,.-]/g, "").replace(",", "."))
        : price;

    // Định dạng lại giá trị bằng cách thêm dấu chấm ngăn cách hàng nghìn và thêm "đ"
    return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const OnChangle = (e) => {
    setContent(e.target.value);
  };

  const ids =
    data.items &&
    data.items.length > 0 &&
    data.items.map((item) => {
      return item.productId;
    });

  console.log(ids);

  const handleFeedBack = async () => {
    if (!content) {
      messageApi.open({
        key,
        type: "error",
        content: "Mong bạn hãy điền nội dung đánh giá!",
        duration: 2,
      });
      return; // Thêm return để dừng hàm nếu content rỗng
    }

    try {
      let res = await feeckacksProductsAPI(ids, userid, value, content);
      console.log(res);

      if (res?.data?.EC === "cập nhật thành công") {
        // Kiểm tra đúng phản hồi API
        messageApi.open({
          type: "success",
          content: "Phản hồi thành công, cảm ơn bạn đã đánh giá sản phẩm!",
          duration: 2,
        });

        setContent("");
        setValue(0);
      } else {
        messageApi.open({
          type: "error",
          content: res?.data?.EC || "Có lỗi xảy ra, vui lòng thử lại!",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Lỗi gửi phản hồi:", error);
      messageApi.open({
        type: "error",
        content: "Lỗi hệ thống, vui lòng thử lại sau!",
        duration: 2,
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title="ĐÁNH GIÁ"
        centered
        open={modal2Open}
        onOk={() => handleFeedBack()}
        onCancel={() => setModal2Open(false)}
      >
        <div>
          {data.items &&
            data.items.length > 0 &&
            data.items.map((item) => {
              return (
                <div
                  className="flex justify-between mt-2 items-center border-b-2"
                  key={item._id}
                >
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-24 h-24 rounded-full object-cover"
                      src={item.image}
                      alt="lỗi"
                    />
                    <div>
                      <span>{item.name}</span>
                      <span className="text-xs block">Màu: {item.color}</span>
                      <span className="text-xs block">
                        Số lượng: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-amber-900">
                    {formatPrice(item.price)}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="">
          <p>Đánh giá sản phẩm</p>
          <Flex gap="middle" vertical className="mt-2">
            <Rate tooltips={desc} onChange={setValue} value={value} />
          </Flex>
        </div>
        <div className="mt-2">
          <p>Nội dung</p>
          <Input.TextArea
            showCount
            maxLength={1000}
            onChange={(e) => OnChangle(e)}
            style={{
              height: 120,
              resize: "none",
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default FeedBack;
