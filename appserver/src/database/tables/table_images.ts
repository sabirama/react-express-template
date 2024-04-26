import { create } from "../mysql";

const table = "images";

const properties = [
    'source VARCHAR(250) NOT NULL',
    'product_id INT(20)',
    'user_id INT(20)',
    'details TEXT',
]

const imagesTable = async () => {
    await create(table, properties)
};

export default imagesTable