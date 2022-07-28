import express from 'express';
import morgan from 'morgan';
import { PORT } from './config';
import path from 'path';

import paymentRoutes from './routes/payments.routes';

const app = express();

app.use(morgan('dev'));

app.use(paymentRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);
console.log("Server on ", PORT);