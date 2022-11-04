const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint. getting ALL tags
router.get("/", async (req, res) => {
  try {
    const allTagData = await Tag.findAll({
      //including products so the tags associated products show up in the get
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(allTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get tags by id and include its assoicated products in the include syntax
router.get("/:id", async (req, res) => {
  try {
    //including products so the tags associated products show up in the get
    const tagByIdData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!tagByIdData) {
      res.status(404).json({ message: "no tag with this id found" });
      return;
    }
    res.status(200).json(tagByIdData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const newProductTagsArray = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(newProductTagsArray);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update tag
router.put("/:id", (req, res) => {
  // update tag data
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated products tags for a  tag when tag id matches the query
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current product ids for the tag
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // create filtered list of new product_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which product tags to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
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

//delete route to delete a tag by its id
router.delete("/:id", async (req, res) => {
  try {
    const deleteSingleTagData = await Tag.destroy({
      //here im telling it to delete based off its id that was searched for in the route
      where: {
        id: req.params.id,
      },
    });
    if (!deleteSingleTagData) {
      res.status(404).json({ message: "no tag with this id found" });
      return;
    }
    res.status(200).json(deleteSingleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
