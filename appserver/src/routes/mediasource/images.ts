import { Router } from "express";
import { resource } from "../../lib/resource/controllerTemplate";
import { uploadFile } from "../../lib/middlewares/googledrive/googledrive";
import { insert, remove, select } from "../../database/mysql";
import deleteFile from "../../lib/middlewares/filestoring/remove";
import multipart from "../../lib/middlewares/filestoring/store";

const images = Router();

const imagesResource = resource("images")

images.get("/", imagesResource.get);

images.get("/:id", imagesResource.getId);

images.post("/", multipart.any(), async (req: any, res: any) => {
    try {
        const file = req.files[0];

        let response: any;

        if (process.env.GOOGLE_STORAGE == "true") {
            response = await uploadFile(file.filename, file.mimetype);
        }

        const data = {
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            details: req.body.details,
            source: response?.id || file.filename,
        }

        const { results } = await insert("images", data)

        return res.status(200).send({ data: results });
    } catch (e) {
        return res.status(500).send({ error: "Server error.", status: 500, message: e.message })
    }
})

images.delete("/:id", async (req: any, res: any) => {
    try {
        const getImage = await select('images', { where: { id: req.params.id } });

        if (getImage.results.length === 0) {
            return res.status(404).send({ error: "Image not found.", status: 404, message: "Image not found." });
        }

        const imagePath = "./storage/files/" + getImage.results[0].source;

        const delImage = await remove('images', req.params.id);

        if (delImage.results) {
            deleteFile(imagePath);
            return res.status(200).send({ message: "Image deleted." });
        } else {
            return res.status(500).send({ error: "Unable to delete image.", status: 500, message: "Unable to delete image." });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({ error: "Server error.", status: 500, message: e.message });
    }
});

export default images