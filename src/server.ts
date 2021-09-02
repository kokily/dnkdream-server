import 'dotenv/config';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { ConnectionOptions } from 'typeorm';
import entities from './entities';

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
