const { AddCategory } = require("./../services/Category");

const CreateCategoryAPI = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Log để kiểm tra giá trị đầu vào
    console.log("Input data:", { name, description });

    // Thêm danh mục cha
    const clothingCategory = await AddCategory(name, description);

    return res.status(201).json({
      message: "Tạo thành công category",
      data: clothingCategory,
    });
  } catch (error) {
    console.error("Đã xảy ra lỗi khi tạo danh mục:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};

module.exports = { CreateCategoryAPI };
