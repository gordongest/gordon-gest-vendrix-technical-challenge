import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Response, Request } from 'express';
import { createClient } from 'redis';
import { GraphQLClient } from 'graphql-request';
import getPaymentCardById from './graphql/getPaymentCardById';
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
    authorization: `Basic ${Buffer.from(process.env.HIGHNOTE_API_KEY!).toString('base64')}`,
  }
});

// app.use is consuming all requests even when other endpoints are defined first, may need to narrow scope or handle methods directly
app.use('/', async (req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  } else if (req.method === 'GET') {
    // fork here
    // check some property of /cards request and call next()
    if (req.path.includes('cards')) {
      return next();
    }
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
      // make request to GraphQL resource
      // if successful, return results as JSON

      // define variables
      const variables = {
        paymentCardId: req.params.cardId
      }

      try {
        // pass query and variables to client request, await response
        const results = await graphQLClient.request(getPaymentCardById, variables);
        return res.status(200).send(results);
      } catch (err) {
        console.log(err.message);
        return res.send({ message: err.message })
      }
    }
);

export default app;
