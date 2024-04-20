import { Request, Response } from 'express';
import User from '../../models/user';
import UserController from './user.controller';
import geolocationService from '../../services/geolocation.service';

jest.mock('../../models/user');

describe('UserController', () => {
  let userController: typeof UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userController = UserController;
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('read', () => {
    it('should list all users', async () => {
      const users = [
        { _id: '66232fd41b30293ed0ef2fe9', name: 'Marcelo Batista Silveira', email: 'marcelo@gmail.com' },
      ];
      User.find = jest.fn().mockResolvedValue(users);
  
      await userController.read(req as Request, res as Response);
  
      expect(User.find).toBeCalled();
      expect(res.json).toBeCalledWith({ users, message: 'Usuários listados com sucesso.' });
    });
  
    it('should return 404 if no users are found', async () => {
      User.find = jest.fn().mockResolvedValue([]);
  
      await userController.read(req as Request, res as Response);
  
      expect(User.find).toBeCalled();
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: 'Nenhum usuário encontrado.' });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'Usuário Teste 8',
        email: 'usuario.teste8@gmail.com',
        address: 'Rua Araguaia 1000',
        coordinates: [-43.3371054, -22.9354907],
        _id: '6623afbc1f0b294685e09d5d',
        __v: 0
      };
      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(user);
      geolocationService.getCoordinates = jest.fn().mockResolvedValue(user.coordinates);
  
      req.body = {
        name: user.name,
        email: user.email,
        address: user.address
      };
  
      await userController.create(req as Request, res as Response);
  
      expect(User.findOne).toBeCalledWith({ $or: [{ name: user.name }, { email: user.email }] });
      expect(User.create).toBeCalledWith({
        name: user.name,
        email: user.email,
        address: user.address,
        coordinates: user.coordinates
      });
      expect(res.json).toBeCalledWith({ user, message: 'Usuário criado com sucesso.' });
    });
  
    it('should return 400 if name is missing', async () => {
      req.body = {
        email: 'usuario.teste8@gmail.com',
        address: 'Rua Araguaia 1000'
      };
  
      await userController.create(req as Request, res as Response);
  
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'O campo nome é obrigatório.' });
    });
  });  

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        _id: '662314fa1809343a11f45380',
        name: 'Marcelo Batista Silveira',
        email: 'celobsilveiraaaaa@gmail.com',
        address: 'Rua João Neves da Fontoura 288',
        coordinates: [-51.1432984, -29.7641102],
        __v: 0
      };
      User.findById = jest.fn().mockResolvedValue(user);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);
      geolocationService.getCoordinates = jest.fn().mockResolvedValue(user.coordinates);
  
      req.params = { id: user._id };
      req.body = {
        email: user.email,
        address: user.address
      };
  
      await userController.update(req as Request, res as Response);
  
      expect(res.json).toBeCalledWith({ userUpdate: user, message: 'Usuário atualizado com sucesso.' });
    });
  
    it('should return 400 if id is invalid', async () => {
      req.params = { id: '662314fa1809343a11f45389aaaa' };
      req.body = {};
  
      await userController.update(req as Request, res as Response);
  
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'ID de usuário inválido.' });
    });
  });  

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = {
        _id: '66230a27b43cf57c56a4a4aa',
        name: 'Marcelo Batista Silveira',
        email: 'celobsilveiraaaaa@gmail.com',
        address: 'Rua João Neves da Fontoura 288',
        coordinates: [-51.1432984, -29.7641102],
        __v: 0
      };
      User.findById = jest.fn().mockResolvedValue(user);
      User.findByIdAndRemove = jest.fn().mockResolvedValue(user);
  
      req.params = { id: user._id };
  
      await userController.delete(req as Request, res as Response);
  
      expect(User.findById).toBeCalledWith(user._id);
      expect(User.findByIdAndRemove).toBeCalledWith(user._id);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({ message: 'Usuário deletado com sucesso.' });
    });
  
    it('should return 404 if user is not found', async () => {
      const id = '66230a27b43cf57c56a4a4aa';
      User.findById = jest.fn().mockResolvedValue(null);
  
      req.params = { id };
  
      await userController.delete(req as Request, res as Response);
  
      expect(User.findById).toBeCalledWith(id);
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ error: 'Usuário não encontrado.' });
    });
  });  
  
});