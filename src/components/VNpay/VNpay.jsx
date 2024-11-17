import { Button, Result } from "antd";

const VNpay = () => {
  return (
    <div>
      <Result
        status="success"
        title="Chúc mừng bạn đã thanh toán thành công đơn hàng bằng Ví VNpay"
        subTitle="Đơn hàng của bạn sẽ được vẫn chuyển đến bạn trong 1 vài ngày tới !!"
        extra={[
          <Button type="primary" key="console">
            Trở lại trang chủ
          </Button>,
          <Button key="buy">Buy Again</Button>,
        ]}
      />
    </div>
  );
};

export default VNpay;
