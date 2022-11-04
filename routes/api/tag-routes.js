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

//post route to create a new tag
router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag, { message: "tag added successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
});

//put route to update a tag by its id
router.put("/:id", async (req, res) => {
  try {
    const updateSingleTagData = await Tag.update(req.body, {
      //here im telling it to update based off its id that was searched for in the route
      where: {
        id: req.params.id,
      },
    });
    if (!updateSingleTagData) {
      res.status(404).json({ message: "no tag with this id found" });
      return;
    }
    res
      .status(200)
      .json(updateSingleTagData, { message: "tag updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
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
    res
      .status(200)
      .json(deleteSingleTagData, { message: "tag deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
