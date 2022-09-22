import express, { NextFunction, Response, Request } from 'express';
import { createClient } from 'redis';
import fetch from 'cross-fetch';
import { gql, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import gqlTag from 'graphql-tag';
import dotenv from 'dotenv'
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

const graphQLClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'https://api.us.test.highnoteplatform.com/graphql', fetch }),
  headers: {
    // TS thinks this might be undefined, possible to create an interface and parser
    authorization: process.env.HIGHNOTE_API_KEY!,
  },
});

app.use('/', async (req: Request, res: Response, next: NextFunction) => {
  const testQuery = {
    query: gql`
      {
        user(id: "26") {
          firstName
        }
      }
    `
  }
  const results = await graphQLClient.query(testQuery);
  console.log("graphQL query results:", results.data);

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
