import { Handler } from 'express';
import { nanoid } from 'nanoid';
import { getConnection, User } from '../db';
import { createToken, hashPassword, maxAge } from '../utils/jwtAuth.utils';

export const findUser = (id: string): User => {
    return getConnection().get('users').find({ id }).value();
};

export const findUserByName = (name: string): User => {
    return getConnection().get('users').find({ name }).value();
};

export const getUsers: Handler = (req, res) => {
    const data = getConnection().get('users').value();
    return res.json(data);
};

export const createUser: Handler = async (req, res) => {
    const { name, password } = req.body;
    const userFound = findUserByName(req.params.name);

    if (userFound) {
        return res.status(500).send('user already exist');
    }

    const newUser = { id: nanoid(), name, password: await hashPassword(password) };
    const token = await createToken(newUser.id);

    try {
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
        getConnection().get('users').push(newUser).write();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getUser: Handler = async (req, res) => {
    const userFound = findUser(req.params.id);
    if (!userFound) return res.status(404).json({ msg: "This user doesn't exist" });

    res.json(userFound);
};

export const deleteUser: Handler = (req, res) => {
    const userFound = findUser(req.params.id);
    if (!userFound) return res.status(404).json({ msg: "This user doesn't exist" });

    const deletedUser = getConnection().get('users').remove({ id: req.params.id }).write();

    res.json(deletedUser);
};
