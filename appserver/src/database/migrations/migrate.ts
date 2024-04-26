import imagesTable from "../tables/table_images";
import productsTable from "../tables/table_products";
import usersTable from "../tables/table_users";

const createTable = async (tables: Function[]) => {
    await Promise.all(tables.map(table => table()));
}

//add create table function for each table in the array
const tables = [
    usersTable,
    productsTable,
    imagesTable
];

createTable(tables)
    .then(() => {
        console.log("Finished creating tables. Exiting process");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error creating tables:", error);
        process.exit(1);
    });