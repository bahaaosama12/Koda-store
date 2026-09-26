const ProductFilter = (query) => {
  const filter = {
    isActive: true,
  };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.subcategory) {
    filter.subcategory = query.subcategory;
  }

  if (query.brand) {
    filter.brand = query.brand;
  }

  if (query.search) {
    filter.$text = {
      $search: query.search,
    };
  }

  const minPrice = Number(query.minPrice);
  const maxPrice = Number(query.maxPrice);

  if (!isNaN(minPrice)) {
    filter.price = {
      $gte: minPrice,
    };
  }

  if (!isNaN(maxPrice)) {
    filter.price = {
      ...filter.price,
      $lte: maxPrice,
    };
  }

  return filter;
};

const ProductSort = (sort) => {
  let sortOption = {};

  if (sort === "price_asc") {
    sortOption = { price: 1 };
  }

  if (sort === "price_desc") {
    sortOption = { price: -1 };
  }

  if (sort === "rating") {
    sortOption = { averageRating: -1 };
  }

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  if (sort === "newest") {
    sortOption = { createdAt: -1 };
  }

  return sortOption;
};

const Pagination = (query, totalProducts) => {
  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    page,
    limit,
    skip,
    totalPages,
  };
};

export { ProductFilter, ProductSort, Pagination };
