import {
  Input,
  Typography,
  Button,
  Flex,
  Select,
  Space,
  InputNumber,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for Quill

import { ListCategoryAPI } from "../../service/ApiCategory";
import { createProductAPI } from "../../service/ApiProduct";
const Create = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [opitonCategory, setOptionCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [image, setImageFiles] = useState([]);
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState();

  // xử lí ảnh
  const [fileList, setFileList] = useState([]);

  const onChangeImg = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Lưu trữ các file ảnh thực tế, không phải chỉ tên
    const files = newFileList.map((file) => file.originFileObj);
    setImageFiles(files);
  };

  const onPreview = async (file) => {
    // You can handle image preview here if needed
    // Example: display modal with the selected image
    const src = file.url || (await getBase64(file.originFileObj));
    const imgWindow = window.open(src);
    imgWindow.document.write(`<img src="${src}" />`);
  };

  // Function to convert file to base64 for preview
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleChange = (value) => {
    setCategoryId(value);
  };

  const handleChangeSize = (value) => {
    setSize(value);
  };

  const handleChangeClor = (value) => {
    setColor(value);
  };

  useEffect(() => {
    const FetchCategory = async () => {
      try {
        const res = await ListCategoryAPI();
        if (res && res.data && res.data.EC === 0) {
          const dataCategory = res.data.data.map((category) => ({
            label: category.name,
            value: category._id,
          }));
          setOptionCategory(dataCategory); // Set the options with IDs and names
        }
      } catch (error) {
        console.log(error);
      }
    };

    FetchCategory();
  }, []);

  const options = opitonCategory.map((category) => ({
    label: category,
    value: category,
  }));

  const optionsSize = [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
    { label: "XL", value: "XL" },
    { label: "XXL", value: "XXL" },
  ];

  const colorArr = ["đen", "trắng", "vàng", "đỏ", "be"];
  const optionsColor = colorArr.map((color) => ({
    label: color,
    value: color,
  }));

  const onChange = (value) => {
    setPrice(value);
  };

  const onChangeStock = (value) => {
    setStock(value);
  };

  const handleCreate = async () => {
    try {
      const res = await createProductAPI(
        name,
        description,
        categoryId,
        brand,
        price,
        stock,
        size,
        color,
        image
      );
      console.log(image);
      console.log(res);
    } catch (error) {}
  };
  console.log(size, color);

  return (
    <div className="w-full ml-6 flex ">
      <div className="w-3/5">
        <Typography.Title level={5}>Name</Typography.Title>
        <Input maxLength={200} value={name} onChange={handleNameChange} />

        <Typography.Title level={5}>Brand</Typography.Title>
        <Input
          maxLength={200}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <Typography.Title level={5} className="mt-4">
          Description
        </Typography.Title>
        <Input.TextArea
          showCount
          maxLength={100}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="disable resize"
          style={{
            height: 120,
            resize: "none",
          }}
        />
        <Typography.Title level={5}>Content</Typography.Title>
        <ReactQuill value={"1"} style={{ height: "300px" }} />
      </div>
      <div className="w-2/5 ">
        <Flex gap="small" wrap className="mt-8 ml-5 ">
          <Button>Cancel</Button>
          <Button type="primary" onClick={handleCreate}>
            Create
          </Button>
        </Flex>

        <div className="ml-5 mt-2">
          <Typography.Title level={5}>Category</Typography.Title>
          <Space
            style={{
              width: "50%",
            }}
            direction="vertical"
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              value={categoryId} // This should hold the category ID(s)
              onChange={handleChange}
              options={opitonCategory} // Use options with IDs and names
            />
          </Space>
        </div>
        <div className="ml-5 mt-2">
          <Typography.Title level={5}>Price</Typography.Title>
          <InputNumber
            style={{
              width: "50%",
            }}
            min={1}
            max={90000000}
            value={price}
            onChange={onChange}
          />
        </div>

        <div className="ml-5 mt-2">
          <Typography.Title level={5}>Stock</Typography.Title>
          <InputNumber
            style={{
              width: "50%",
            }}
            min={0}
            max={10000}
            value={stock}
            onChange={onChangeStock}
          />
        </div>
        <div className="ml-5 mt-2">
          <Typography.Title level={5}>Size</Typography.Title>
          <Space
            style={{
              width: "50%",
            }}
            direction="vertical"
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              value={size}
              onChange={handleChangeSize}
              options={optionsSize}
            />
          </Space>
        </div>

        <div className="ml-5 mt-2">
          <Typography.Title level={5}>Color</Typography.Title>
          <Space
            style={{
              width: "50%",
            }}
            direction="vertical"
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              value={color}
              onChange={handleChangeClor}
              options={optionsColor}
            />
          </Space>
        </div>

        <div className="ml-5 mt-2">
          <ImgCrop rotationSlider>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChangeImg}
              onPreview={onPreview}
              multiple
              beforeUpload={() => false} // Prevent automatic upload
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </div>
      </div>
    </div>
  );
};

export default Create;
