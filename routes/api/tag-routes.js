const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const allTagData = await Tag.findAll({
      //including products so the categories associated products show up in the get
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(allTagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get("/:id", async (req, res) => {
  try {
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
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }

  // create a new tag
});

router.put("/:id", async (req, res) => {
  try {
    const updateSingleTagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!updateSingleTagData) {
      res.status(404).json({ message: "no tag with this id found" });
      return;
    }
    res.status(200).json(updateSingleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // update a tag's name by its `id` value
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteSingleTagData = await Tag.destroy({
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
  // delete on tag by its `id` value
});

module.exports = router;
