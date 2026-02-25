import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use(routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));
  
  app.get('*', (req, res) => {
    res.sendFile(join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
