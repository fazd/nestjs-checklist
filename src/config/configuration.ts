import { Configuration } from './interfaces/configuration.interface';

export default function (): Configuration {
  return {
    port: Number(process.env.PORT),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    jwtKey: process.env.JWT_KEY,
  };
}
