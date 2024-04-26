import { Router } from "express";
import { routerResource } from "../../lib/resource/controllerTemplate";
import { hasImages } from "../../database/tables/table_products";

const products = Router();

routerResource(products, 'products', { join: [hasImages] });

export default products;