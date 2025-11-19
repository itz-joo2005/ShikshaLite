const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// In-memory storage for game scores
let gameScores = {
    color: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
    animal: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
    memory: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
    count: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
    gesture: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity }
};

// Get all scores
app.get('/api/scores', (req, res) => {
    res.json(gameScores);
});

// Update game score
app.post('/api/scores/:game', (req, res) => {
    const { game } = req.params;
    const { correct, responseTime } = req.body;
    
    if (!gameScores[game]) {
        return res.status(400).json({ error: 'Invalid game' });
    }
    
    gameScores[game].totalQuestions++;
    if (correct) {
        gameScores[game].score++;
        if (responseTime < gameScores[game].bestSpeed) {
            gameScores[game].bestSpeed = responseTime;
        }
    }
    
    // Calculate average speed
    const speeds = [];
    if (responseTime) speeds.push(responseTime);
    gameScores[game].avgSpeed = speeds.length > 0 ? 
        speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    
    res.json(gameScores[game]);
});

// Reset scores
app.post('/api/reset', (req, res) => {
    gameScores = {
        color: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
        animal: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
        memory: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
        count: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity },
        gesture: { score: 0, totalQuestions: 0, avgSpeed: 0, bestSpeed: Infinity }
    };
    res.json({ message: 'Scores reset' });
});

// Get animal sounds list
app.get('/api/sounds', (req, res) => {
    const soundsDir = path.join(__dirname, 'sounds');
    const soundFiles = fs.readdirSync(soundsDir)
        .filter(file => file.endsWith('.wav'))
        .map(file => ({
            name: file.replace('.wav', ''),
            file: `sounds/${file}`,
            animal: file.split(/[0-9]/)[0] || file.replace('.wav', '')
        }));
    res.json(soundFiles);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});