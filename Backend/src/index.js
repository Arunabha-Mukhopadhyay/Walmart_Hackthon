import { app } from "./app.js";
import connectDB from "./db/DB.js";
import dotenv from 'dotenv';

dotenv.config({ 
  path: '../.env' 
});

connectDB()


.then(()=>{
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
})
.catch((error) => {
  console.error('Failed to connect to the database:', error);
});






// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();


// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Welcome to the Backend API');
// }
// );

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// }
// );