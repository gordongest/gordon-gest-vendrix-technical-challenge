import express, { NextFunction, Response, Request } from 'express';
import { createClient } from 'redis';
import fetch from 'cross-fetch';
import { gql, request, GraphQLClient } from 'graphql-request'
import gqlTag from 'graphql-tag';
import dotenv from 'dotenv';
// -------------------------------------------------------------
dotenv.config();

// -------------------------------------------------------------
const app = express();

// Body Parser
app.use(express.json());
let redisClient: any;

(async () => {
  redisClient = createClient();

  redisClient.on('error', (error: unknown) =>
    console.error(`Error : ${error}`)
  );

  await redisClient.connect();
})();

const graphQLClient = new GraphQLClient('https://api.us.test.highnoteplatform.com/graphql', {
  headers: {
    contentType: 'application/json',
    // TS thinks this might be undefined, possible to create an interface and parser
    authorization: 'Basic c2tfdGVzdF85dHlYdk53VDlmcG5raEExdWdRRDZnU0duanp1aGRlNEhMZ1VGQVdKcmdWRlRlaWsyVVlvUmF4azJvcm9Qbng5NWloeFR1bnJhaVZ5M2JDRU41Og==',
  }
});

app.use('/', async (req: Request, res: Response, next: NextFunction) => {
  /* GraphQLClient query */
  const testQuery = gql`
      query Ping {
        ping
      }
    `
  const results = await graphQLClient.request(testQuery);
  console.log("Highnote test query results:", results);

  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  } else if (req.method === 'GET') {
    const cacheResults = await redisClient.get('users');
    if (cacheResults) {
      console.log('cached users', { data: JSON.parse(cacheResults) });
      return res.status(200).json({
        data: JSON.parse(cacheResults),
      });
    } else {
      console.log('no cached users');
      return res.status(200).json({
        data: [],
      });
    }
  } else {
    const cacheResults = await redisClient.get('users');
    if (cacheResults) {
      await redisClient.set(
        'users',
        JSON.stringify([...JSON.parse(cacheResults), req.body])
      );
      const updatedData = await redisClient.get('users');

      console.log('updated cached users', { data: req.body });
      return res.status(200).json({
        data: JSON.parse(updatedData),
      });
    } else {
      await redisClient.set('users', JSON.stringify([req.body]));
      const updatedData = await redisClient.get('users');

      console.log('initiated users', { data: JSON.parse(updatedData) });
      return res.status(200).json({
        data: JSON.parse(updatedData),
      });
    }
  }
  // can't make it here because all requests are consumed and sending responses
  next();
});

/**
 * Second Phase Stub Out
 *
 * TODO: implement endpoint
 */
app.use(
  '/cards/:cardId',
  async (req: Request, res: Response, next: NextFunction) => {
    next();
  }
);

export default app;
