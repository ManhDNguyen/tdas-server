const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const fileController = require("../controllers/fileController");

router.get("/calc", testController.handleGetCalculations);
router.post("/calc", testController.handleSaveCalculations);
router.get("/", testController.handleGetTest);
router.get("/testlist", testController.handleGetList);
router.post(
  "/upload",
  (req, res, next) => {
    fileController.upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: "Error uploading file" });
      }
      next();
    });
  },
  fileController.handleFileUpload
);
router.post("/remove", testController.handleRemoveTestById);

module.exports = router;
