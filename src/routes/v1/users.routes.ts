import { Router } from 'express';
import { getUsers, createUser, getUser, deleteUser } from '../../controllers/user.controller';

const router = Router();

router.get('/users', getUsers);

router.get('/user/:id', getUser);

router.post('/users', createUser);

router.delete('/user/:id', deleteUser);

export default router;
