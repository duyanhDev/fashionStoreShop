import { useEffect } from "react";
import axios from "./../../untils/axios";
import "./Cart.css";
import { Input, Select, Radio, Button, Table, notification } from "antd";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createOrder } from "../../service/Oder";
import { SmileOutlined } from "@ant-design/icons";
import ClipLoader from "react-spinners/ClipLoader";

const CartProducts = ({}) => {
  const { ListCart, user, CartListProductsUser } = useOutletContext();

  const [loadingSpin, setLoadingSpin] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [value, setValue] = useState(1);
  const [provine, SetProvine] = useState([]);
  const [district, setDistrict] = useState([]);
  const [warn, setWarn] = useState([]);
  const [id, SetId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [WarnDistrict, setSelectedWarnDistrict] = useState("");
  const [priceObj, setPriceObj] = useState({});
  const [Products, setProducts] = useState([]);

  const [Name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [CartId, setCartId] = useState("");
  const [productId, setProductId] = useState([]);

  const formatPrice = (price) => {
    // Nếu price là chuỗi, chuyển đổi nó thành một số
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^\d,.-]/g, "").replace(",", "."))
        : price;

    // Định dạng lại giá trị bằng cách thêm dấu chấm ngăn cách hàng nghìn và thêm "đ"
    return numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const DataProvine = async () => {
    try {
      let api = "https://esgoo.net/api-tinhthanh/1/0.htm";
      let res = await axios.get(api);
      if (res.data && res.data.data) {
        const dataProvines = res.data.data.map((data) => {
          return { id: data.id, name: data.name };
        });
        SetProvine(dataProvines);
      }
    } catch (error) {}
  };

  const DistrstData = async () => {
    try {
      let url = `https://esgoo.net/api-tinhthanh/2/${id}.htm`;
      let res = await axios.get(url);
      if (res.data && res.data.data) {
        const data = res.data.data.map((item) => {
          return { id: item.id, name: item.full_name };
        });
        setDistrict(data);
      }
    } catch (error) {}
  };
  const WarnData = async () => {
    try {
      let url = `https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`;
      let res = await axios.get(url);
      if (res.data && res.data.data) {
        const data = res.data.data.map((item) => {
          return { id: item.id, name: item.full_name };
        });
        setWarn(data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    DataProvine();
  }, []);

  useEffect(() => {
    DistrstData();
  }, [id]);
  useEffect(() => {
    WarnData();
  }, [selectedDistrict]);

  const handleProvinceChange = (value, name) => {
    SetId(value);
    setDistrict([]); // Xóa các quận/huyện khi thay đổi tỉnh
    setSelectedDistrict("");
    setSelectedWarnDistrict("");
    setCity(name.label);
    setWarn([]); // Reset giá trị quận/huyện đã chọn
  };

  const handleDistrictChange = (value, name) => {
    setSelectedDistrict(value);
    setDistrictName(name.label);
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const data =
    ListCart && ListCart.items && ListCart.items.length > 0
      ? ListCart.items.map((item, index) => {
          return {
            key: index + 1,
            id: item.productId._id,
            images: (
              <img
                src={item.productId.variants[0]?.images[0]?.url}
                alt="Product"
                style={{ width: "50px", height: "50px" }}
              />
            ),
            name: item.productId.name,
            color: item.color,
            quantity: item.quantity,
            size: item.size,
            price: formatPrice(item.price),
            totalItemPrice: item.totalItemPrice + "đ",
          };
        })
      : [];

  const [checkedItems, setCheckedItems] = useState([]);

  // const handleCheck = (
  //   id,
  //   name,
  //   size,
  //   quantity,
  //   color,
  //   price,
  //   itemID,
  //   productId
  // ) => {
  //   // Chuyển đổi giá trị price từ chuỗi (nếu cần) thành số
  //   setProductId((prev) => {
  //     if (prev.includes(productId)) {
  //       return prev.filter((item) => item !== productId);
  //     } else {
  //       return [...prev, productId];
  //     }
  //   });
  //   const numericPrice =
  //     typeof price === "string"
  //       ? parseFloat(price.replace(/[^\d,.-]/g, "").replace(",", "."))
  //       : price;

  //   setCartId(itemID);

  //   // Cập nhật state cho id của sản phẩm được chọn
  //   setProducts((prevState) => {
  //     if (!Array.isArray(prevState)) {
  //       prevState = [];
  //     }

  //     const existingProductIndex = prevState.findIndex(
  //       (product) => product.id === id
  //     );

  //     if (existingProductIndex !== -1) {
  //       return prevState.map((product, index) =>
  //         index === existingProductIndex
  //           ? {
  //               ...product,
  //               name,
  //               size,
  //               quantity,
  //               color,
  //               price: numericPrice, // Cập nhật giá trị numericPrice
  //             }
  //           : product
  //       );
  //     }

  //     return [
  //       ...prevState,
  //       {
  //         id,
  //         name,
  //         quantity,
  //         size,
  //         color,
  //         price: numericPrice, // Cập nhật giá trị numericPrice
  //       },
  //     ];
  //   });

  //   // Cập nhật giá trị totalItemPrice cho các sản phẩm đã chọn
  //   setPriceObj((prevPriceObj) => {
  //     const newPriceObj = { ...prevPriceObj };
  //     if (newPriceObj[id]) {
  //       delete newPriceObj[id];
  //     } else {
  //       newPriceObj[id] = numericPrice;
  //     }
  //     return newPriceObj;
  //   });

  //   setCheckedItems((prevCheckedItems) => {
  //     if (prevCheckedItems.includes(id)) {
  //       return prevCheckedItems.filter((itemId) => itemId !== id);
  //     } else {
  //       return [...prevCheckedItems, id];
  //     }
  //   });
  // };

  const handleSelectAll = () => {
    // Kiểm tra xem tất cả các sản phẩm đã được chọn chưa
    const allSelected =
      Array.isArray(checkedItems) && checkedItems.length === data?.length;
    if (allSelected) {
      // Nếu tất cả đã được chọn, bỏ chọn tất cả
      setCheckedItems([]);
      setPriceObj({});
      setProductId([]);
      setCartId("");
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả
      data.map((product) => {
        console.log(product);

        const allProductIds = []; // Mảng để lưu tất cả productId
        const { id, name, size, quantity, color, totalItemPrice } = product;

        // Lưu productId vào allProductIds
        allProductIds.push(id);

        setCartId(ListCart._id);

        // Chuyển đổi giá trị price thành số nếu cần
        const numericPrice =
          typeof totalItemPrice === "string"
            ? parseFloat(
                totalItemPrice
                  .replace(/[^\d,.-]/g, "") // Loại bỏ ký tự không phải số
                  .replace(",", ".") // Thay dấu phẩy thành dấu chấm
              )
            : totalItemPrice;

        // Tạo key duy nhất cho sản phẩm
        const uniqueKey = `${id}-${size}-${color}`;

        // Cập nhật danh sách productId (chọn tất cả productId)
        setProductId((prev) => {
          if (prev.includes(allProductIds)) {
            return prev.filter((item) => item !== id);
          } else {
            return [...prev, id];
          }
        });

        // Cập nhật danh sách sản phẩm
        setProducts((prevState) => {
          if (!Array.isArray(prevState)) {
            prevState = [];
          }

          // Kiểm tra sản phẩm dựa trên key duy nhất
          const existingProductIndex = prevState.findIndex(
            (product) =>
              product.id === id &&
              product.size === size &&
              product.color === color
          );

          if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, cập nhật thông tin
            return prevState.map((product, index) =>
              index === existingProductIndex
                ? {
                    ...product,
                    name,
                    size,
                    quantity,
                    color,
                    price: numericPrice, // Cập nhật giá
                  }
                : product
            );
          }

          // Nếu sản phẩm chưa tồn tại, thêm mới
          return [
            ...prevState,
            {
              id,
              name,
              quantity,
              size,
              color,
              price: numericPrice,
            },
          ];
        });

        // Cập nhật giá trị priceObj
        setPriceObj((prevPriceObj) => {
          const newPriceObj = { ...prevPriceObj };
          newPriceObj[uniqueKey] = numericPrice; // Lưu giá trị giá sản phẩm
          return newPriceObj;
        });

        // Cập nhật danh sách sản phẩm đã chọn
        setCheckedItems((prevCheckedItems) => {
          if (prevCheckedItems.includes(uniqueKey)) {
            return prevCheckedItems;
          } else {
            return [...prevCheckedItems, uniqueKey];
          }
        });
      });
    }
  };

  const handleCheck = (
    id,
    name,
    size,
    quantity,
    color,
    price,
    itemID,
    productId
  ) => {
    console.log(price);

    // Chuyển đổi giá trị price thành số nếu cần
    const numericPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^\d,.-]/g, "").replace(",", "."))
        : price;

    // Tạo một key duy nhất cho sản phẩm dựa trên id, size và color
    const uniqueKey = `${id}-${size}-${color}`;

    // Cập nhật danh sách productId (chọn hoặc bỏ chọn productId)
    setProductId((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((item) => item !== productId);
      } else {
        return [...prev, productId];
      }
    });

    setCartId(itemID);

    // Cập nhật danh sách sản phẩm
    setProducts((prevState) => {
      if (!Array.isArray(prevState)) {
        prevState = [];
      }

      // Kiểm tra sản phẩm dựa trên key duy nhất
      const existingProductIndex = prevState.findIndex(
        (product) =>
          product.id === id && product.size === size && product.color === color
      );

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật thông tin
        return prevState.map((product, index) =>
          index === existingProductIndex
            ? {
                ...product,
                name,
                size,
                quantity,
                color,
                price: numericPrice,
              }
            : product
        );
      }

      // Nếu sản phẩm chưa tồn tại, thêm mới
      return [
        ...prevState,
        {
          id,
          name,
          quantity,
          size,
          color,
          price: numericPrice,
        },
      ];
    });

    // Cập nhật giá trị totalItemPrice
    setPriceObj((prevPriceObj) => {
      const newPriceObj = { ...prevPriceObj };
      if (newPriceObj[uniqueKey]) {
        delete newPriceObj[uniqueKey];
      } else {
        newPriceObj[uniqueKey] = numericPrice;
      }
      return newPriceObj;
    });

    // Cập nhật danh sách sản phẩm đã chọn
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(uniqueKey)) {
        // Nếu sản phẩm đã chọn, bỏ chọn
        return prevCheckedItems.filter((itemKey) => itemKey !== uniqueKey);
      } else {
        // Nếu sản phẩm chưa chọn, thêm vào
        return [...prevCheckedItems, uniqueKey];
      }
    });
  };

  const totalCheckedPrice = checkedItems.reduce((total, itemId) => {
    return total + (priceObj[itemId] || 0);
  }, 0);

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "images",
      key: "images",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Giá từng sản phẩm",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalItemPrice",
      key: "totalItemPrice",
    },
    {
      title: (
        <input
          type="checkbox"
          checked={
            data.length > 0 &&
            data.every((item) =>
              checkedItems.includes(`${item.id}-${item.size}-${item.color}`)
            )
          }
          onChange={handleSelectAll}
        />
      ),
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={checkedItems.includes(
            `${record.id}-${record.size}-${record.color}`
          )}
          onChange={() =>
            handleCheck(
              record.id,
              record.name,
              record.size,
              record.quantity,
              record.color,
              record.totalItemPrice,
              ListCart._id,
              record.id
            )
          }
        />
      ),
    },
  ];

  const handleOrder = async () => {
    try {
      setLoadingSpin(true);
      // Ensure each item has productId
      const formattedItems = Products.map((item) => ({
        ...item,
        productId: item.id, // Assuming `id` is the field that should be mapped to `productId`
      }));
      if (
        !Name ||
        !email ||
        !number ||
        !fullAddress ||
        !district ||
        !wardName
      ) {
        notification.error({
          message: "Lỗi đặt hàng",
          description: "Vui lòng nhập đầy đủ thông tin trước khi đặt hàng.",
        });
        setLoadingSpin(false);
        return;
      }
      let res = await createOrder(
        user._id,
        Name,
        number,
        formattedItems, // Pass items with productId
        fullAddress,
        city,
        districtName,
        wardName,
        value,
        email,
        CartId,
        productId
      );

      if (res && res.data.EC === 0) {
        await CartListProductsUser();

        setTimeout(() => {
          setLoadingSpin(false);
          api.open({
            message: "Đặt Hàng",
            description: "Chúc mừng quý khách đã đặt hàng thành công tại shop",
            icon: (
              <SmileOutlined
                style={{
                  color: "#108ee9",
                }}
              />
            ),
          });

          res.data.vnpUrl ? (window.location.href = res.data.vnpUrl) : null;
          res.data.data.shortLink
            ? (window.location.href = res.data.data.payUrl)
            : null;
        }, 3000);
      }
    } catch (error) {
      setLoadingSpin(false);
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div className="h-screen w-full mt-28">
      <div className="cart flex justify-between">
        <div className="w-1/2">
          <h1 className="text-3xl font-semibold">Thông tin đặt hàng</h1>
          <div className="mt-4 gap-4 flex items-center">
            <div className="w-2/3">
              <label className="text-sm">Họ và tên</label>
              <Input
                placeholder="Nhập họ và tên"
                onChange={(e) => setName(e.target.value)}
                value={Name}
                status={!Name && "error"}
              />
            </div>
            <div className="w-1/3">
              <label className="text-sm">Số điện thoại</label>
              <Input
                placeholder="Nhập số điện thoại"
                type="number"
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                status={!number && "error"}
              />
            </div>
          </div>
          <div className="mt-2 ">
            <div className="">
              <label className="text-sm">Emai</label>
              <Input
                placeholder="Nhập email của bạn"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                status={!email && "error"}
              />
            </div>
          </div>
          <div className="mt-2 ">
            <div className="">
              <label className="text-sm">Địa chỉ</label>
              <Input
                placeholder="Nhập địa chỉ của bạn"
                onChange={(e) => setFullAddress(e.target.value)}
                value={fullAddress}
                status={!fullAddress && "error"}
              />
              <div className="mt-2">
                <div className="flex gap-2">
                  <Select
                    placeholder="Chọn Tỉnh/Thành Phố"
                    status={!id && "error"}
                    value={id}
                    style={{
                      flex: 1,
                    }}
                    // Đặt giá trị quận/huyện đã chọn
                    options={[
                      {
                        value: "",
                        label: "Chọn Tỉnh/Thành Phố",
                        disabled: true,
                      },
                      ...provine.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                    onChange={handleProvinceChange}
                  />
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    style={{
                      flex: 1,
                    }}
                    value={selectedDistrict} // Đặt giá trị quận/huyện đã chọn
                    status={!selectedDistrict && "error"}
                    options={[
                      {
                        value: "",
                        label: "Chọn Quận/Huyện",
                        disabled: true,
                      },
                      ...district.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                    onChange={handleDistrictChange}
                  />
                  <Select
                    placeholder="Chọn Phường/Xã"
                    style={{
                      flex: 1,
                    }}
                    value={WarnDistrict}
                    status={!WarnDistrict && "error"}
                    options={[
                      {
                        value: "",
                        label: "Chọn Phường/Xã",
                        disabled: true,
                      },
                      ...warn.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                    onChange={(value, name) => {
                      setSelectedWarnDistrict(value);
                      setWardName(name.label);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl font-semibold">Hình thức thanh toán</h1>
            <div className="mt-3">
              <Radio.Group onChange={onChange} value={value} className="w-full">
                <div className="h-50 pay">
                  <Radio value={1}>
                    <div className="flex gap-3">
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip3_6.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />
                      <div className="">
                        <p className="font-bold text-sm">
                          Thanh toán qua ZaloPay
                        </p>
                        <span className="flex w-full gap-3 text-[#737373]">
                          Hỗ trợ mọi hình thức thanh toán
                          <img
                            src="https://mcdn.coolmate.me/image/October2024/mceclip0_27.png"
                            alt="lỗi"
                            className="w-64"
                          />
                        </span>
                      </div>
                    </div>
                  </Radio>
                </div>
                <div className="h-50 pay">
                  <Radio value={"cod"}>
                    <div className="flex gap-3 items-center">
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip2_42.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />

                      <p className="font-bold text-sm ">
                        Thanh toán khi nhận hàng
                      </p>
                    </div>
                  </Radio>
                </div>
                <div className="h-50 pay">
                  <Radio value={"momo"}>
                    <div className="flex gap-3 items-center">
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip1_171.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />

                      <p className="font-bold text-sm ">Ví MoMo</p>
                    </div>
                  </Radio>
                </div>
                <div className="h-50 pay">
                  <Radio value={"vnpay"} onChange={onChange}>
                    <div className="flex gap-3">
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />
                      <div className="">
                        <p className="font-bold text-sm">Ví điện tủ VNPAY</p>
                        <span className="flex w-full gap-3 text-[#737373]">
                          Quét QZ để thanh toán
                        </span>
                      </div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </div>
          </div>
        </div>
        {loadingSpin && (
          <div className="overlay1 fixed flex items-center justify-center ">
            <ClipLoader className="" />
          </div>
        )}
        <div className="w-1/2 h-full">
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={{
              total: data.length,
              pageSize: 5,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} sản phẩm`,
              className: "pagination-custom",
            }}
          />
        </div>
      </div>
      <div className="footer w-full flex">
        <div className="flex flex-1 cart_1 justify-between items-center">
          <div className="flex items-center justify-center flex-1 border-r-2 border-r-[#333]">
            <span className="text-center">
              {(() => {
                switch (value) {
                  case 1:
                    return (
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip3_6.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />
                    );
                  case "cod":
                    return (
                      <div className="flex gap-3 items-center">
                        <img
                          src="https://mcdn.coolmate.me/image/October2024/mceclip2_42.png"
                          alt="lõi"
                          className="w-11 h-full"
                        />

                        <p className="font-bold text-sm ">
                          COD thanh toán khi nhận hàng
                        </p>
                      </div>
                    );
                  case "momo":
                    return (
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip1_171.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />
                    );
                  case "vnpay":
                    return (
                      <img
                        src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
                        alt="lõi"
                        className="w-11 h-full"
                      />
                    );
                  default:
                    return "The value is unknown";
                }
              })()}
            </span>
          </div>
          <div className="flex flex-1 justify-center w-full ">
            <span className="text-center text-[#2F5ACF] font-bold">
              Chưa dùng voucher
            </span>
          </div>
        </div>
        <div className="flex flex-1 cart_2 justify-center items-center gap-3">
          <div>
            <span>Thành tiền </span>
            <span className="text-xl text-[#2F5ACF] font-bold">
              {checkedItems.length > 0
                ? formatPrice(totalCheckedPrice)
                : formatPrice(0)}
            </span>
          </div>
          <div>
            <Button
              type="dark"
              className="h-8 p-5 border-none bg-gray-800 text-[#fff] rounded-2xl hover:bg-gray-700 transition"
              onClick={handleOrder}
            >
              ĐẶT HÀNG
            </Button>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default CartProducts;
