# ShikshaLite - Accessible Learning Games

Voice-controlled educational games designed for children with physical, cognitive, or sensory disabilities.

## 🚀 Quick Start

1. **Double-click** `start-server.bat` to start local server
2. **Open Chrome** and go to `http://localhost:3000`
3. **Allow microphone access** when prompted
4. **Say game names** to start playing!

## 🎮 Available Games

### Basic Games (index.html)
- **Memory Challenge** - Remember sequences
- **QuickCount** - Count objects by voice

### Advanced Games (super_game.html)
- **Color Learning** - Learn colors with shapes
- **Animal Sounds** - Identify animals by sound
- **Memory Challenge** - Advanced memory training
- **QuickCount** - Advanced counting game
- **Gesture Maestro** - Camera-based gesture recognition

## 📁 Project Structure

```
ShikshaLite/
├── super_game.html         # Advanced games (5 games)
├── script.js              # Game logic for basic games
├── styles.css             # Styling for all games
├── server.js              # Local development server
├── start-server.bat       # Easy server startup
├── package.json           # Node.js dependencies
├── assets/                # SVG icons for games
│   ├── apple.svg
│   ├── circle.svg
│   ├── heart.svg
│   ├── star.svg
│   └── triangle.svg
├── sounds/                # Animal sound files
│   ├── cat4.wav
│   ├── dog-bark3.wav
│   ├── horse3.wav
│   ├── duck3.wav
│   ├── cock1.wav
│   ├── goose1.wav
│   └── lion1.wav
└── docs/                  # Documentation
    ├── SETUP.md           # Detailed setup guide
    └── AI_MODEL_SPECIFICATION.md
```

## 🎤 Voice Commands

- **Game Selection**: "color", "animal", "memory", "count", "gesture"
- **Game Control**: "start", "next", "back", "repeat"
- **Answers**: Say colors, animals, numbers, or objects

## 🌐 Browser Requirements

- **Google Chrome** (recommended for best voice support)
- **Microphone access** enabled
- **Camera access** (for gesture game only)
- **JavaScript** enabled

## 🔧 Development

```bash
npm install          # Install dependencies
npm start           # Start development server
```

## ♿ Accessibility Features

- High contrast colors (WCAG AA compliant)
- Large touch targets (44px minimum)
- Voice input/output capabilities
- Keyboard navigation support
- Screen reader compatible
- Clear error messages and feedback

---

**Built for inclusive education - Every child can learn and play! 🌟**