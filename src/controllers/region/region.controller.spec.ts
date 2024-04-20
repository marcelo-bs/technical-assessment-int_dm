import { Response, Request } from 'express';
import RegionController from './region.controller';
import Region from '../../models/region';
import User from '../../models/user';

describe('RegionController', () => {
  let regionController: typeof RegionController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    regionController = RegionController;
    req = {} as Request;
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe('create', () => {
    it('should create a region', async () => {
      req.body = {
        name: "Centro de uma cidade qualquer",
        coordinates: [
            -43.3371054,
            -22.9354907
        ],
        owner: "6623afbc1f0b294685e09d5d"
      };

      const user = new User();
      User.findById = jest.fn().mockResolvedValue(user);

      const region = new Region();
      Region.create = jest.fn().mockResolvedValue(region);

      await regionController.create(req, res);

      expect(User.findById).toBeCalledWith('6623afbc1f0b294685e09d5d');
      expect(Region.create).toBeCalledWith({
        name: "Centro de uma cidade qualquer",
        coordinates: [
          -43.3371054,
          -22.9354907
        ],
        owner: "6623afbc1f0b294685e09d5d",
      });

      expect(res.json).toBeCalledWith(region);
    });

    it('should return an error if user is not found', async () => {
      req.body = {
        name: "Centro de uma cidade qualquer",
        coordinates: [
          -43.3371054,
          -22.9354907
        ],
        owner: "6623afbc1f0b294685e09d5daaaaaaaaaaaaaa",
      };

      User.findById = jest.fn().mockResolvedValue(null);

      await regionController.create(req, res);

      expect(User.findById).toBeCalledWith('6623afbc1f0b294685e09d5daaaaaaaaaaaaaa');
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'Usuário não encontrado.' });
    });
  });

  describe('read', () => {
    it('should return a region', async () => {
      const region = new Region();
      Region.find = jest.fn().mockResolvedValue([region]);
      expect(Region).toBe(Region);
    }, 20000);
  
  });
  
  describe('update', () => {
    it('should return an error if the region is not found', async () => {
      Region.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    
      req.params = { id: '66231a43ca409cdf4a26d641aaaaa' };
      req.body = {
        name: 'Centro de uma cidade qualquer',
        coordinates: [-51.1776978, -29.93997449999999],
        owner: '662314fa1809343a11f45380'
      };
    
      await regionController.update(req, res);
    
      expect(res.json).toBeCalledWith({ error: 'ID da região inválida.' });
    });
  });
  
  describe('delete', () => {
    it('should delete a region and send a error message', async () => {
      Region.findOne = jest.fn().mockResolvedValue(null);
  
      req.params = { id: '66234799d24fc0c574cfa888' };
  
      await regionController.delete(req, res);
  
      expect(res.json).toBeCalledWith({ error: 'Região não encontrada.' });
      expect(res.status).toBeCalledWith(404);
    }, 30000);
  });
  
  describe('listByPoint', () => {
    it('should list regions by point', async () => {
      const regions = [{
        _id: '66233340d8bc107b448ff3c7',
        name: 'Zona Norte de Porto Alegre',
        coordinates: [-51.214457, -30.04521279999999],
        owner: '662332ebd8bc107b448ff3c3',
        "__v": 0
      }];
      Region.find = jest.fn().mockResolvedValue(regions);
  
      const coordinates = 
        [
          -51.1711621,
          -30.0092174
        ];
  
      await regionController.listByPoint(req, res);
  
      expect(Region.find).toBeCalledWith({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            }
          }
        }
      });
      expect(res.json).toBeCalledWith({ address: "Av. Assis Brasil, 1504 - Passo d'Areia, Porto Alegre - RS, 91010-001, Brazil", regions });
    });

  });
  
  describe('listByDistance', () => {
    it('should list regions by distance', async () => {
      const regions = [
        {
          _id: '66233340d8bc107b448ff3c7',
          name: 'Zona Norte de Porto Alegre',
          coordinates: [-51.1711621, -30.0092174],
          owner: '662332ebd8bc107b448ff3c3',
          __v: 0
        },
      ];
      Region.find = jest.fn().mockResolvedValue(regions);
  
      req.body = { 
        coordinates: [-51.214457, -30.04521279999999],
        distance: 10000,
        filterUser: true,
        user: '662332ebd8bc107b448ff3c3'
      };
  
      await regionController.listByDistance(req, res);
  
      expect(Region.find).toBeCalledWith({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: req.body.coordinates
            },
            $maxDistance: req.body.distance
          }
        },
        owner: req.body.filterUser ? req.body.user : { $exists: true }
      });
      expect(res.json).toBeCalledWith(regions);
    });
  });
});