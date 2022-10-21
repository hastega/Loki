import { Handler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUser } from '../controllers/user.controller';

export const maxAge = 1 * 24 * 60 * 60;

export const hashPassword = (password: string): Promise<string> => {
	return bcrypt.genSalt().then((salt: string) => bcrypt.hash(password, salt));
};

export const deHashPassword = (inputPassword: string, encryptedPassword: string): Promise<boolean> => {
	return bcrypt.compare(inputPassword, encryptedPassword).then((auth: boolean) => auth);
};

export const createToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_KEY as string, {
		expiresIn: maxAge * 1000,
	});
};

export const checkUser: Handler = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.JWT_KEY as string, async (err: any, decodedToken: any) => {
			if (err) {
				res.status(401).send(err.message);
				res.locals.user = null;
			} else {
				const userLocals = await findUser(decodedToken.id);
				res.locals.user = userLocals;
				next();
			}
		});
	} else {
		res.status(400).send('invalid Token');
		res.locals.user = null;
	}
};
