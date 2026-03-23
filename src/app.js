import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express'; 
import emailRoutes from './routes/email.routes.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json()); // <-- super important pour recevoir JSON

app.use((req, res, next) => {
    console.log('=== SMTP DEBUG ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', {
        'content-type': req.headers['content-type'],
        'accept': req.headers['accept'],
        'user-agent': req.headers['user-agent']
    });
    console.log('Body:', req.body);
    console.log('================');
    next();
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/mail', emailRoutes);

// Middleware d'erreur (en dernier)
app.use(errorHandler);

export default app;
