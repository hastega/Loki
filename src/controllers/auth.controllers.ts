import { Handler } from "express"
import { createToken, deHashPassword, maxAge } from "../utils/jwtAuth.utils";
import { findUserByName } from "./user.controller";

export const login: Handler = async (req,res) => {
    const { name, password } = req.body;

    const userFound = await findUserByName(name);

    if (userFound) {
        const token = await createToken(userFound.id);

        if (await deHashPassword(password, userFound.password)) {
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})
            return res.status(201).json(userFound);
        }
        res.status(400).send('incorrected password');
    }
    res.status(400).send('incorrected name');
    
}

export const logout: Handler = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1});
    res.send('user disconnected');
}
  