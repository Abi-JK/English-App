import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// In production or when running locally via Node, serve the built React files
// We will serve the 'dist' folder which Vite generates when we run 'npm run build'
app.use(express.static(path.join(__dirname, 'dist')));

// A simple API route to test the backend
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AuraEnglish API is running perfectly!' });
});

// For any other route, send the React index.html so React Router handles the routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Ensure you have run "npm run build" to build the React frontend before starting this server.');
});
