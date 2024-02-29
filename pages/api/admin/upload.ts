import type { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { isAdmin, isAuth } from "../../../app/utils/auth";
import { onError } from "../../../app/utils/error";
import dbConnect from "../../../lib/dbConnect";

import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import multer from "multer";
import path from "path";
import Product from "../../../models/Product";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = nextConnect({ onError });
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File is not supported"));
      return;
    }
    cb(null, true);
  },
});

handler
  .use(isAuth, isAdmin, upload.single("file"))
  .post(async (req: any, res: NextApiResponse) => {
    await dbConnect();
    try {
      const product = await Product.findById(req.body.productId);

      // Destroy old Image if it exists //
      if (req.body.imageField === "file") {
        product.cloudinary_id_image &&
          (await cloudinary.uploader.destroy(product.cloudinary_id_image));
      }

      // Destroy old Featured Image if it exists //
      if (req.body.imageField === "featuredFile") {
        product.cloudinary_id_featuredImage &&
          (await cloudinary.uploader.destroy(
            product.cloudinary_id_featuredImage
          ));
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "Amazona",
      });

      // Update Public ID of Image //
      if (req.body.imageField === "file") {
        await Product.findByIdAndUpdate(req.body.productId, {
          cloudinary_id_image: result.public_id,
        });
      }

      // Update Public ID of Featured Image //
      if (req.body.imageField === "featuredFile") {
        await Product.findByIdAndUpdate(req.body.productId, {
          cloudinary_id_featuredImage: result.public_id,
        });
      }

      res.send(result);
    } catch (error) {
      console.log(error, "Something wrong Happend in upload");
      res.status(500).json({
        message: "Something wrong Happend in upload",
      });
    }
  });

export default handler;
