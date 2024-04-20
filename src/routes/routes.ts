import { Router } from 'express';
import userController from '../controllers/user/user.controller';
import regionController from '../controllers/region/region.controller';

const router = Router();

// Rotas para UserController
router.post('/users/create', userController.create);
router.get('/users/list-all', userController.read);
router.get('/users/list-user/:id', userController.readOne);
router.put('/users/update/:id', userController.update);
router.delete('/users/delete/:id', userController.delete);
router.get('/users/export', userController.export);

// Rotas para RegionController
router.post('/regions/create', regionController.create);
router.get('/regions/list-all', regionController.read);
router.get('/regions/list-region/:id', regionController.readOne);
router.put('/regions/update/:id', regionController.update);
router.delete('/regions/delete/:id', regionController.delete);
router.get('/regions/list-by-point', regionController.listByPoint);
router.get('/regions/list-by-distance', regionController.listByDistance);
router.get('/regions/export', regionController.export);

export default router;