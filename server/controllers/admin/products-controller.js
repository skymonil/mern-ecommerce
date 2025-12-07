require("dotenv").config();
const { handleImageUploadUtil } = require("../../helpers/cloudinary");

const handleImageUpload = async(req , res) =>{
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const filePath = `data:${req.file.mimetype};base64,${b64}`;
        const result = await handleImageUploadUtil(filePath);
        res.json({
            success: true,
            result,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Image upload failed"});
    }
}

//add a new product
const addProduct  =async(req , res) =>{
    try {
        const {image,title, description, category, price, salePrice,totalStock} = req.body;

        const newlyAddedProducts = new Product({
            image,
            title,
            description,
            category,
            price,
            salePrice,
            totalStock,
        });

        await newlyAddedProducts.save();
        res.json({success: true, message: "Product added successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Adding product failed"});
    }
}



//fetch  all products
const fetchAllProducts = async(req , res) =>{
    try {
        const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Fetching products failed"});
    }
}

// edit a product
const editProduct = async(req , res ) =>{
     try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

        
//delete a product
const deleteProduct = async(req , res) =>{
    try {
        const {id} = req.params;
  const Product = await Product.findByIdAndDelete(id);
  if(!Product){
    return res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    })
    } catch (error) {
        console.log(error);
       res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
    }
}
module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct,
};