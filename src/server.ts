import express from 'express';
import routes from './routes/routes'; 
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger';
import logger from './logger';
import init from '../src/database';

const server = express();

const PORT = process.env.API_PORT || 3003;

server.use(express.json());

server.use(routes);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.get('/', (req, res) => res.send('Olá, mundo!'));

(async () => {
  await init();
  server.listen(PORT, () => logger.info(`Server iniciado na porta ${PORT}`));
})();