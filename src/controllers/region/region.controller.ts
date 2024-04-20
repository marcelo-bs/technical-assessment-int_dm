import { Request, Response } from 'express';
import Region from '../../models/region';
import User from '../../models/user';
import logger from '../../logger';
import geolocationService from '../../services/geolocation.service';
import mongoose from 'mongoose';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import path from 'path';

class RegionController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, coordinates, owner } = req.body    
    const user = await User.findById(owner);
    if (!user) {
      logger.error('Usuário não encontrado.');
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    if (!name) {
      return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    }    

    logger.info(`Criando região: ${name}`);

    const region = await Region.create({
      name,
      coordinates,
      owner,
    });

    logger.info(`Região criada: ${region.id}`);

    return res.json(region);
  }

  async read(req: Request, res: Response): Promise<Response> {
    logger.info('Buscando todas as regiões');

    const regions = await Region.find();

    if (regions.length === 0) {
      return res.status(404).json({ message: 'Nenhuma região encontrada.' });
    }

    return res.json(regions);
  }

  async readOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.info(`Buscando região: ${id}`);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de região inválido.' });
    }
  
    const region = await Region.findById(id);
  
    if (!region) {
      return res.status(404).json({ message: 'Região não encontrada.' });
    }
  
    return res.json({ region, message: 'Região listada com sucesso.' });
  }  

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.info(`Atualizando região: ${id}`);

    const { name, coordinates, owner } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID da região inválida.' });
    }
  
    const region = await Region.findById(id);
    if (!region) {
      return res.status(404).json({ error: 'Região não encontrada.' });
    }
  
    const user = await User.findById(owner);
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }
  
    if (!coordinates) {
      return res.status(400).json({ error: 'Forneça alguma coordenada.' });
    }
  
    const updatedRegion = await Region.findByIdAndUpdate(id, {
      name,
      coordinates,
      owner,
    }, { new: true });
  
    return res.json({ region: updatedRegion, message: 'Região atualizada com sucesso.' });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    logger.info(`Deletando região: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID da região inválida.' });
    }

    const region = await Region.findById(id);
    if (!region) {
      return res.status(404).json({ error: 'Região não encontrada.' });
    }  

    await Region.findByIdAndRemove(id);

    logger.info(`Região deletada: ${id}`);

    return res.status(200).json({ message: 'Região deletada com sucesso.' });
  }

  async listByPoint(req: Request, res: Response): Promise<Response> {
    logger.info('Listando regiões por ponto');

    const { coordinates } = req.body;
  
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ error: 'Coordenadas inválidas.' });
    }
  
    const address = await geolocationService.getAddress(coordinates);
  
    const regions = await Region.find({
      coordinates: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates,
          },
        },
      },
    });
  
    return res.json({ address, regions });
  }

  async listByDistance(req: Request, res: Response): Promise<Response> {
      logger.info('Listando regiões por distância');

      const { coordinates, distance, user, filterUser } = req.body;
    
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        return res.status(400).json({ error: 'Coordenadas inválidas.' });
      }
    
      if (!distance || typeof distance !== 'number') {
        return res.status(400).json({ error: 'Distância é obrigatória e deve ser um número.' });
      }
    
      let query = {
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $maxDistance: distance,
          },
        },
      };
    
      if (filterUser) {
        query['owner'] = user;
      }
    
      const regions = await Region.find(query);
    
      return res.json(regions);
  }

  async export(req: Request, res: Response): Promise<any> {
    logger.info('Exportando regiões para CSV');
  
    const regions = await Region.find().lean();
  
    const regionsArray = regions.map(region => ({ name: region.name, coordinates: region.coordinates }));
  
    const dir = path.join(__dirname, '../../exports');
    fs.mkdirSync(dir, { recursive: true });
  
    const filePath = path.join(dir, 'Regions.csv');
    const ws = fs.createWriteStream(filePath);
    ws.on('error', err => {
      console.error('Erro ao escrever o arquivo CSV:', err);
    });
    fastcsv
      .write(regionsArray, { headers: true })
      .on('finish', function() {
        ws.end();
      })
      .pipe(ws);
  
    ws.on('close', () => {
      res.download(filePath);
    });
  } 

}

export default new RegionController();