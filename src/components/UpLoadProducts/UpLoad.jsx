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
import { useParams } from "react-router-dom";
import { ListOneProductAPI } from "../../service/ApiProduct";

const UpLoad = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const param = useParams();

  // xử lí ảnh
  const [fileList, setFileList] = useState([{}]);

  console.log(fileList);

  const onChangeImg = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // const categories = ["Áo", "Quần"];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const handleChange1 = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    const CallApiListProduct = async () => {
      try {
        const res = await ListOneProductAPI(param.id);

        if (res && res.data.EC === 0) {
          setName(res.data.data.name || "");
          setDescription(res.data.data.description || "");
          setCategory([res.data.data.category.name] || []);
          setPrice(res.data.data.price || "");
          setStock(res.data.data.stock || "");
          setSize(res.data.data.size || []);
          setColor(res.data.data.color || []);
          setFileList(
            res.data.data.images.map((image) => ({
              url: image,
              name: image || "Image",
            })) || []
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    CallApiListProduct();
  }, [param.id]);
  const options = category.map((category) => ({
    label: category,
    value: category,
  }));
  const options1 = size.map((size) => ({
    label: size,
    value: size,
  }));
  const onChange = (value) => {
    console.log("changed", value);
  };

  return (
    <div className="w-full ml-6 flex ">
      <div className="w-3/5">
        <Typography.Title level={5}>Name</Typography.Title>
        <Input maxLength={200} value={name} onChange={handleNameChange} />
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
        <ReactQuill
          value={"1"}
          style={{ height: "300px" }} // Đặt chiều cao cho trình soạn thảo
        />
      </div>
      <div className="w-2/5 ">
        <Flex gap="small" wrap className="mt-8 ml-5 ">
          <Button>Cancel</Button>
          <Button type="primary">Update</Button>
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
              defaultValue={"Áo"}
              onChange={handleChange}
              options={options}
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
            onChange={onChange}
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
              onChange={handleChange1}
              options={options1}
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
              onChange={handleChange1}
              options={options1}
            />
          </Space>
        </div>

        <div className="ml-5 mt-2">
          <ImgCrop rotationSlider>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onChange={onChangeImg}
              onPreview={onPreview}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </div>
      </div>
    </div>
  );
};

export default UpLoad;
