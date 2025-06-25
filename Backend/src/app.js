import express from 'express';
import cors from 'cors';    
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());



// Import routes
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import shelfRoutes from './routes/shelf.routes.js';
import { setupRoutes as setupAIRoutes } from './utils/ai.js';



//routes declaration
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/purchase-recommendations', purchaseRoutes);
app.use('/api/v1/shelves', shelfRoutes);

setupAIRoutes(app);


export{app};