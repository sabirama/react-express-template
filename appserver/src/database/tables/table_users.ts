import { create } from "../mysql";

const table = "users";

const properties = [
    'username VARCHAR(50) UNIQUE NOT NULL',
    'email VARCHAR(250) UNIQUE NOT NULL',
    'password VARCHAR(50) NOT NULL'
]

const usersTable = async () => {
   await create(table, properties)
};

export default usersTable