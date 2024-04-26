import { Router } from "express";
import { users } from "./users/users";
import products from "./products/products";
import images from "./mediasource/images";
import files from "./files/files";

const api = Router();

api.get("/", (req: any, res: any) => {
    res.status(200).send("API SERVER");
})
    .use('/users', users)
    .use('/products', products)
    .use('/images', images)
    .use('/files', files)

export default api;