import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export type User = {
    id: string;
    name: string;
    password: string;
};

type Schema = {
    users: User[];
};

let db: lowdb.LowdbSync<Schema>;

export const createConnection = async () => {
    const adapter = new FileSync<Schema>('db.json');
    db = lowdb(adapter);
    db.defaults({ users: [] }).write();
};

export const getConnection = () => db;
