const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint
// get all products
router.get("/", async (req, res) => {
  try {
    const allProductData = await Product.findAll({
      //including category model  so the product get returns with  associated category show up in the get and also the tag model so tags data also is joined to the response
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    res.status(200).json(allProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product by id
router.get("/:id", async (req, res) => {
  try {
    //including category model  so the product get returns with  associated category show up in the get and also the tag model so tags data also is joined to the response. includes will join the category and tag in the reponse
    const productByIdData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    if (!productByIdData) {
      res.status(404).json({ message: "no product with this id found" });
      return;
    }
    res.status(200).json(productByIdData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteProductData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deleteProductData) {
      res.status(404).json({ message: "no product with this id found" });
      return;
    }
    res.status(200).json(deleteProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
