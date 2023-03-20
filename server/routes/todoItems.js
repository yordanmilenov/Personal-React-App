const router = require("express").Router();

const todoItemsModel = require("../models/todoItems");
const urlPath = "/api/item"

router.post( urlPath , async (req, res) => {
    try {
        const newItem = new todoItemsModel({
            item: req.body.item,
        });
        const saveItem = await newItem.save();
        res.status(200).json(saveItem);
    } catch (error) {
        res.status(404).json({ message: "Something's wrong" });
    }
});

router.get(`${urlPath}s`, async (req, res) => {
    try {
        const allTodoItems = await todoItemsModel.find({});
        res.status(200).json(allTodoItems);
    } catch (error) {
        res.status(404).json({ message: "Something's wrong" });
    }
});

router.put(`${urlPath}/:id`, async (req, res) => {
    try {
      const item = await todoItemsModel.findById(req.params.id);
  
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      item.item = req.body.item;
      const updatedItem = await item.save();
  
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.delete(`${urlPath}/:id`, async (req, res) => { 
    const item = await todoItemsModel.findById(req.params.id);
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Item Deleted");
});

module.exports = router;
