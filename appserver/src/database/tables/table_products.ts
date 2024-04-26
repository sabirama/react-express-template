import { create } from "../mysql";

const table = "products";

const properties = [
    'name VARCHAR(250) NOT NULL',
    'details TEXT NOT NULL',
    'price INT(20)',
    'stock INT(20)',
    'image_type DEFAULT item_image'
]

const productsTable = async () => {
    await create(table, properties)
};

export const hasImages = {
    table: 'images',
    foreign_key: 'product_id',
    local_key: 'id',
    join_keys: 'id, product_id, source, details'

}

export default productsTable