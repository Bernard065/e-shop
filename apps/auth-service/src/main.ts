import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.AUTH_PORT ? Number(process.env.AUTH_PORT) : 6001;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
