import 'dotenv/config';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-koa';
import Koa, { Context } from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import schema from './libs/schema';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { ConnectionOptions, createConnection } from 'typeorm';
import entities from './entities';
import upload from './libs/upload';
import jwtMiddleware from './libs/authenticate';

const Options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: true,
  entities,
};

const _bootStrap = async () => {
  try {
    await createConnection(Options);

    const configurations = {
      production: { ssl: true, port: 443, hostname: 'api.dnkdream.com' },
      development: { ssl: false, port: 4000, hostname: 'localhost' },
    };
    const environment = process.env.NODE_ENV || 'production';
    const config = configurations[environment];

    const app = new Koa();
    const router = new Router();

    const apollo = new ApolloServer({
      schema,
      context: ({ ctx }: { ctx: Context }) => {
        return {
          ctx,
        };
      },
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    app.use(
      cors({
        origin:
          process.env.NODE_ENV === 'production'
            ? 'https://dnkdream.com'
            : 'http://localhost:3000',
        credentials: true,
      })
    );
    app.use(bodyParser({ multipart: true }));
    app.use(jwtMiddleware);
    app.use(router.routes());
    app.use(router.allowedMethods());

    await apollo.start();

    router.use('/upload', upload.routes());
    router.get('/graphql', apollo.getMiddleware({ cors: false }));
    router.post('/graphql', apollo.getMiddleware({ cors: false }));

    apollo.applyMiddleware({ app });

    let server;

    if (config.ssl) {
      server = https.createServer(
        {
          key: fs.readFileSync(`${process.env.SSL_KEY}`),
          cert: fs.readFileSync(`${process.env.SSL_CERT}`),
        },
        app.callback()
      );
    } else {
      server = http.createServer(app.callback());
    }

    await server.listen(config.port, () => {
      console.log(
        `> Backend Server on http${config.ssl ? 's' : ''}://${config.hostname}:${
          config.port
        }`
      );
    });
  } catch (err) {
    console.error(err);
  }
};

_bootStrap();
