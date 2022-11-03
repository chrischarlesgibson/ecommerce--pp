const router = require("express").Router();
const { Category, Product } = require("../../models");

//the get route for all categories and their associated products. api/categories route
router.get("/", async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      //including products so the categories associated products show up in the get
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all categories
  // be sure to include its associated Products
});

//route to get product by its id
router.get("/:id", async (req, res) => {
  try {
    const categoryIdData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryIdData) {
      res.status(404).json({ message: "no product with this id found" });
      return;
    }
    res.status(200).json(categoryIdData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

//post route to create a new category
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const updateCategoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!updateCategoryData) {
      res.status(404).json({ message: "no category with this id found" });
      return;
    }
    res.status(200).json(updateCategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteIdData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deleteIdData) {
      res.status(404).json({ message: "no category with this id found" });
      return;
    }
    res.status(200).json(deleteIdData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
