const Category = require("./../Model/Category");

const AddCategory = async (name, description) => {
  console.log(name, description);

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      console.log("Danh mục đã tồn tại");
      return;
    }

    const newCategory = await Category.create({ name, description });

    console.log("Danh mục đã được thêm thành công:", newCategory);
    return newCategory;
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
  }
};

module.exports = { AddCategory };
