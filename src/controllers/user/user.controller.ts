import { Request, Response } from 'express';
import User from '../../models/user';
import geolocationService from '../../services/geolocation.service';
import logger from '../../logger';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import mongoose from 'mongoose';
import path from 'path';

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, address, coordinates } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    }
  
    if (!email) {
      return res.status(400).json({ error: 'O campo email é obrigatório.' });
    }    

    if ((address && coordinates) || (!address && !coordinates)) {
      return res.status(400).json({ error: 'Forneça endereço ou coordenadas, não ambos ou nenhum.' });
    }

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário com este nome ou email já existe.' });
    }    

    let userCoordinates = coordinates;
    if (address) {
      userCoordinates = await geolocationService.getCoordinates(address);
    }

    logger.info(`Criando usuário: ${name}, ${email}`);

    const user = await User.create({
      name,
      email,
      address,
      coordinates: userCoordinates,
    });

    logger.info(`Usuário criado: ${user.id}`);

    return res.json({ user, message: 'Usuário criado com sucesso.' });
  }

  async read(req: Request, res: Response): Promise<Response> {
    logger.info('Buscando todos os usuários');

    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
    }

    return res.json({ users, message: 'Usuários listados com sucesso.' });
  }

  async readOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.info(`Buscando usuário: ${id}`);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de usuário inválido.' });
    }
  
    const user = await User.findById(id);
  
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  
    return res.json({ user, message: 'Usuário listado com sucesso.' });
  }  

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.info(`Atualizando usuário: ${id}`);

    const { name, email, address, coordinates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de usuário inválido.' });
    }    

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if ((address && coordinates) || (!address && !coordinates)) {
      return res.status(400).json({ error: 'Forneça endereço ou coordenadas, não ambos ou nenhum.' });
    }

    let userCoordinates = coordinates;
    if (address) {
      userCoordinates = await geolocationService.getCoordinates(address);
    }

    const userUpdate = await User.findByIdAndUpdate(id, {
      name,
      email,
      address,
      coordinates: userCoordinates,
    }, { new: true });

    return res.json({ userUpdate, message: 'Usuário atualizado com sucesso.' });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.info(`Deletando usuário: ${id}`);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de usuário inválido.' });
    }
  
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }    
  
    await User.findByIdAndRemove(id);
  
    logger.info(`Usuário deletado: ${id}`);
  
    return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  }

  async export(req: Request, res: Response): Promise<any> {
    logger.info('Exportando usuários para CSV');
  
    const users = await User.find().lean();
  
    const usersArray = users.map(user => ({ name: user.name, email: user.email, address: user.address }));
  
    const dir = path.join(__dirname, '../../exports');
    fs.mkdirSync(dir, { recursive: true });
  
    const filePath = path.join(dir, 'Users.csv');
    const ws = fs.createWriteStream(filePath);
    ws.on('error', err => {
      console.error('Erro ao escrever o arquivo CSV:', err);
    });
    fastcsv
      .write(usersArray, { headers: true })
      .on('finish', function() {
        ws.end();
      })
      .pipe(ws);
  
    ws.on('close', () => {
      res.download(filePath);
    });
  }
}

export default new UserController();