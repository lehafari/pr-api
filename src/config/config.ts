import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  database: {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: '79zsh7UFG5wQBbfdeH8Q',
    name: 'prseconecta',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}));
