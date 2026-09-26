import Product from "../models/Product.model.js";

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment, rating } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        message: "product not found",
      });
    }

    const duplicatedReview = product.reviews.find((review) => {
      return review.user.toString() === req.user._id.toString();
    });
    if (duplicatedReview) {
      return res.status(400).send({
        message: "you already add review for this product",
      });
    }
    product.reviews.push({
      user: req.user._id,
      comment,
      rating,
    });

    product.calcAverageRating();

    await product.save();
    return res.status(200).send({
      message: "review added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        message: "product not found",
      });
    }
    return res.status(200).send({
      success: true,
      review: product.reviews,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        message: "product not found",
      });
    }
    const review = await product.reviews.find((review) => {
      return review._id.toString() === reviewId;
    });
    if (!review) {
      return res.status(404).send({
        message: "review not found",
      });
    }
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send({
        message: "you are not allowed to delete this review",
      });
    }
    product.reviews = await product.reviews.filter((review) => {
      return review._id.toString() !== reviewId;
    });
    product.calcAverageRating();
    await product.save();
    res.status(200).send({
      message: "review deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

export { addReview, getReview, deleteReview };
