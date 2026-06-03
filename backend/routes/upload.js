const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post(
  "/upload-video",
  upload.single("video"),
  async (req, res) => {

    try {

      const videoPath = req.file.path;

      console.log("Uploaded:", videoPath);

      exec(
        `py ../detection/detect.py "${videoPath}"`,
        (error, stdout, stderr) => {

          console.log("STDOUT:");
          console.log(stdout);

          console.log("STDERR:");
          console.log(stderr);

          if (error) {

            console.log(error);

            return res.status(500).json({
              success: false,
              error: error.message
            });
          }

          res.json({
            success: true,
            message: "Video processed",
            output: stdout
          });

        }
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

module.exports = router;