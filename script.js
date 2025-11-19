// Continuous Voice Recognition Game
class GameDashboard {
    constructor() {
        this.currentGame = null;
        this.voiceEnabled = true;
        this.waitingForAnswer = false;
        this.waitingForNext = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.level = 1;
        
        this.gameData = {
            memory: {
                level1: [
                    { 
                        sequence: ["🍎", "🍌", "🍊"], 
                        question: "What was the first fruit?", 
                        options: ["🍌 Banana", "🍎 Apple", "🍊 Orange", "🍇 Grape"], 
                        correct: 1 
                    },
                    { 
                        sequence: ["🐱", "🐶", "🐠"], 
                        question: "What was in the middle?", 
                        options: ["🐱 Cat", "🐶 Dog", "🐠 Fish", "🐦 Bird"], 
                        correct: 1 
                    }
                ]
            },
            quickcount: {
                level1: [
                    { object: "apple", count: 3, image: "assets/apple.svg" },
                    { object: "star", count: 5, image: "assets/star.svg" },
                    { object: "heart", count: 2, image: "assets/heart.svg" },
                    { object: "circle", count: 4, image: "assets/circle.svg" },
                    { object: "triangle", count: 1, image: "assets/triangle.svg" }
                ]
            }
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.requestMicrophoneAccess();
    }
    
    initializeElements() {
        this.dashboard = document.getElementById('dashboard');
        this.gameArea = document.getElementById('gameArea');
        this.questionText = document.getElementById('questionText');
        this.answerOptions = document.getElementById('answerOptions');
        this.feedback = document.getElementById('feedback');
        this.startBtn = document.getElementById('startBtn');
        this.speakBtn = document.getElementById('speakBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.voiceToggle = document.getElementById('voiceToggle');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
    }
    
    setupEventListeners() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectGame(e.target.closest('.game-card').dataset.game));
        });
        
        this.startBtn.addEventListener('click', () => this.startGame());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.voiceToggle.addEventListener('click', () => this.toggleVoice());
        document.getElementById('backBtn').addEventListener('click', () => this.showDashboard());
    }
    
    async requestMicrophoneAccess() {
        try {
            // Request microphone with specific constraints for Chrome
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            // Stop the stream immediately as we only need permission
            stream.getTracks().forEach(track => track.stop());
            console.log('✅ Microphone access granted');
            this.setupVoiceRecognition();
        } catch (error) {
            console.error('❌ Microphone access denied:', error);
            this.showMicrophoneError();
        }
    }
    
    showMicrophoneError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #ff4757; color: white; padding: 15px 25px;
            border-radius: 10px; z-index: 1000; font-weight: bold;
            box-shadow: 0 4px 15px rgba(255,71,87,0.3);
        `;
        errorDiv.innerHTML = `
            🎤 Microphone Access Required<br>
            <small>Click the microphone icon in Chrome's address bar and allow access</small>
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 3;
            
            this.recognition.onstart = () => {
                console.log('🎤 Voice recognition active');
            };
            
            this.recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        const spokenText = event.results[i][0].transcript.toLowerCase().trim();
                        console.log('👂 Heard:', spokenText);
                        this.processVoiceCommand(spokenText);
                    }
                }
            };
            
            this.recognition.onerror = (event) => {
                console.log('⚠️ Speech error:', event.error);
                if (event.error === 'not-allowed') {
                    this.showMicrophoneError();
                    return;
                }
                if (event.error !== 'aborted' && event.error !== 'no-speech') {
                    this.restartRecognition();
                }
            };
            
            this.recognition.onend = () => {
                console.log('🔄 Restarting recognition...');
                this.restartRecognition();
            };
            
            this.startRecognition();
            this.speak('Say memory or quickcount to choose a game.');
        } else {
            this.showBrowserError();
        }
    }
    
    showBrowserError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #ff6b6b; color: white; padding: 20px;
            border-radius: 15px; z-index: 1000; max-width: 400px;
            text-align: center; box-shadow: 0 8px 25px rgba(255,107,107,0.3);
        `;
        errorDiv.innerHTML = `
            <h3>🌐 Browser Requirements</h3>
            <p>For voice commands to work:</p>
            <ul style="text-align: left; margin: 10px 0;">
                <li>Use Google Chrome browser</li>
                <li>Serve from HTTPS or localhost</li>
                <li>Allow microphone access</li>
            </ul>
            <button onclick="this.parentElement.remove()" style="
                background: white; color: #ff6b6b; border: none;
                padding: 8px 15px; border-radius: 5px; cursor: pointer;
            ">Got it!</button>
        `;
        document.body.appendChild(errorDiv);
    }
    
    startRecognition() {
        if (this.recognition && this.voiceEnabled) {
            try {
                this.recognition.start();
            } catch (error) {
                console.log('Recognition start error:', error);
                setTimeout(() => this.startRecognition(), 1000);
            }
        }
    }
    
    restartRecognition() {
        if (this.voiceEnabled) {
            setTimeout(() => {
                this.startRecognition();
            }, 100);
        }
    }
    
    speak(text) {
        if (this.voiceEnabled && 'speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            console.log('🔊 Speaking:', text);
            speechSynthesis.speak(utterance);
        }
    }
    
    processVoiceCommand(spokenText) {
        console.log('🧠 Processing:', spokenText);
        
        // Game selection
        if (spokenText.includes('memory') || spokenText.includes('remember')) {
            this.selectGame('memory');
            return;
        }
        if (spokenText.includes('quickcount') || spokenText.includes('count')) {
            this.selectGame('quickcount');
            return;
        }
        
        // Navigation
        if (spokenText.includes('back') || spokenText.includes('home')) {
            this.showDashboard();
            return;
        }
        
        // Start game
        if (spokenText.includes('start')) {
            this.startGame();
            return;
        }
        
        // Next command
        if (this.waitingForNext && spokenText.includes('next')) {
            this.waitingForNext = false;
            this.nextQuestion();
            return;
        }
        
        // Answer processing
        if (this.waitingForAnswer) {
            if (this.currentGame === 'quickcount') {
                this.processQuickCountAnswer(spokenText);
            } else if (this.currentGame === 'memory') {
                this.processMemoryAnswer(spokenText);
            }
        }
    }
    
    selectGame(gameType) {
        this.currentGame = gameType;
        this.dashboard.style.display = 'none';
        this.gameArea.style.display = 'block';
        this.resetGame();
        
        this.questionText.textContent = `Ready to play ${gameType.charAt(0).toUpperCase() + gameType.slice(1)}!`;
        this.speak(`Say start game to begin.`);
    }
    
    resetGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.level = 1;
        this.waitingForAnswer = false;
        this.waitingForNext = false;
        this.startBtn.style.display = 'inline-block';
        this.nextBtn.style.display = 'none';
        this.answerOptions.innerHTML = '';
        this.feedback.textContent = '';
        this.updateScore();
    }
    
    showDashboard() {
        this.dashboard.style.display = 'block';
        this.gameArea.style.display = 'none';
        this.currentGame = null;
        this.waitingForAnswer = false;
        this.waitingForNext = false;
        this.speak('Choose a game. Say memory or quickcount.');
    }
    
    startGame() {
        this.resetGame();
        this.startBtn.style.display = 'none';
        
        this.speak('Game started!');
        setTimeout(() => {
            if (this.currentGame === 'quickcount') {
                this.showQuickCountQuestion();
            } else {
                this.showQuestion();
            }
        }, 2000);
    }
    
    showQuickCountQuestion() {
        const questions = this.gameData.quickcount.level1;
        
        if (this.currentQuestion >= questions.length) {
            this.endQuickCountLevel();
            return;
        }
        
        const currentQ = questions[this.currentQuestion];
        
        this.feedback.textContent = '';
        this.nextBtn.style.display = 'none';
        this.questionText.textContent = `How many ${currentQ.object}s do you see?`;
        
        // Display images
        this.answerOptions.innerHTML = '';
        const imageContainer = document.createElement('div');
        imageContainer.className = 'counting-container';
        
        for (let i = 0; i < currentQ.count; i++) {
            const img = document.createElement('img');
            img.src = currentQ.image;
            img.alt = `${currentQ.object} ${i + 1}`;
            img.className = 'counting-object';
            imageContainer.appendChild(img);
        }
        
        this.answerOptions.appendChild(imageContainer);
        
        this.speak(`How many ${currentQ.object}s do you see?`);
        this.waitingForAnswer = true;
    }
    
    processQuickCountAnswer(spokenText) {
        const questions = this.gameData.quickcount.level1;
        const currentQ = questions[this.currentQuestion];
        const spokenNumber = this.extractNumberFromSpeech(spokenText);
        
        if (spokenNumber !== null) {
            this.waitingForAnswer = false;
            
            if (spokenNumber === currentQ.count) {
                this.correctAnswers++;
                this.score += 10;
                this.feedback.textContent = `Correct! ${currentQ.count} ${currentQ.object}${currentQ.count > 1 ? 's' : ''}!`;
                this.feedback.className = 'feedback correct';
                this.updateScore();
                
                this.speak(`Excellent! That's correct! ${currentQ.count} ${currentQ.object}${currentQ.count > 1 ? 's' : ''}! Say next to continue.`);
                this.waitingForNext = true;
                this.nextBtn.style.display = 'inline-block';
            } else {
                this.feedback.textContent = `Wrong! Try again.`;
                this.feedback.className = 'feedback incorrect';
                this.speak(`Wrong answer. The correct answer is ${currentQ.count}. Try again. How many ${currentQ.object}s do you see?`);
                this.waitingForAnswer = true;
            }
        }
    }
    
    extractNumberFromSpeech(text) {
        const numberWords = {
            'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
        };
        
        for (let word in numberWords) {
            if (text.includes(word)) {
                return numberWords[word];
            }
        }
        
        const digitMatch = text.match(/\b(\d+)\b/);
        if (digitMatch) {
            return parseInt(digitMatch[1]);
        }
        
        return null;
    }
    
    showQuestion() {
        const questions = this.gameData.memory.level1;
        if (this.currentQuestion >= questions.length) {
            this.endGame();
            return;
        }
        
        const question = questions[this.currentQuestion];
        this.showMemorySequence(question);
    }
    
    showMemorySequence(question) {
        this.questionText.textContent = "Remember this sequence:";
        this.answerOptions.innerHTML = '';
        this.feedback.textContent = '';
        
        const sequenceDiv = document.createElement('div');
        sequenceDiv.style.cssText = 'display: flex; justify-content: center; gap: 20px; margin: 30px 0; font-size: 4rem;';
        
        question.sequence.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = item;
            itemDiv.style.cssText = 'padding: 20px; background: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);';
            sequenceDiv.appendChild(itemDiv);
        });
        
        this.answerOptions.appendChild(sequenceDiv);
        
        this.speak("Remember this sequence carefully.");
        setTimeout(() => {
            this.askMemoryQuestion(question);
        }, 4000);
    }
    
    askMemoryQuestion(question) {
        this.questionText.textContent = question.question;
        this.answerOptions.innerHTML = '';
        
        const { shuffledOptions, newCorrectIndex } = this.shuffleOptions(question);
        this.currentCorrectIndex = newCorrectIndex;
        
        shuffledOptions.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => this.selectAnswer(index));
            this.answerOptions.appendChild(btn);
        });
        
        this.speak(`${question.question} Say your answer.`);
        this.waitingForAnswer = true;
    }
    
    processMemoryAnswer(spokenText) {
        const currentOptions = Array.from(document.querySelectorAll('.option-btn')).map(btn => btn.textContent);
        let selectedIndex = -1;
        
        currentOptions.forEach((option, index) => {
            const optionText = option.toLowerCase();
            if (spokenText.includes('apple') && optionText.includes('apple') ||
                spokenText.includes('banana') && optionText.includes('banana') ||
                spokenText.includes('orange') && optionText.includes('orange') ||
                spokenText.includes('red') && optionText.includes('red') ||
                spokenText.includes('blue') && optionText.includes('blue') ||
                spokenText.includes('green') && optionText.includes('green') ||
                spokenText.includes('cat') && optionText.includes('cat') ||
                spokenText.includes('dog') && optionText.includes('dog') ||
                spokenText.includes('fish') && optionText.includes('fish')) {
                selectedIndex = index;
            }
        });
        
        if (selectedIndex !== -1) {
            this.selectAnswer(selectedIndex);
        }
    }
    
    selectAnswer(selectedIndex) {
        this.waitingForAnswer = false;
        const isCorrect = selectedIndex === this.currentCorrectIndex;
        
        if (isCorrect) {
            this.score += 10;
            this.feedback.textContent = "Correct! Well done!";
            this.feedback.className = 'feedback correct';
            this.updateScore();
            
            this.speak("Excellent! That's correct! Say next to continue.");
            this.waitingForNext = true;
            this.nextBtn.style.display = 'inline-block';
        } else {
            this.feedback.textContent = "Wrong answer. Try again!";
            this.feedback.className = 'feedback incorrect';
            this.speak("Wrong answer. Try again.");
            this.waitingForAnswer = true;
        }
        
        this.disableOptions();
    }
    
    shuffleOptions(question) {
        const shuffled = [...question.options];
        const correctAnswer = shuffled[question.correct];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return { shuffledOptions: shuffled, newCorrectIndex: shuffled.indexOf(correctAnswer) };
    }
    
    nextQuestion() {
        this.waitingForNext = false;
        this.currentQuestion++;
        this.nextBtn.style.display = 'none';
        
        if (this.currentGame === 'quickcount') {
            this.showQuickCountQuestion();
        } else {
            this.showQuestion();
        }
    }
    
    endQuickCountLevel() {
        this.questionText.textContent = 'Level Complete!';
        this.answerOptions.innerHTML = '';
        
        const summary = `You answered ${this.correctAnswers} out of 5 correctly.`;
        this.feedback.textContent = summary;
        this.feedback.className = 'feedback correct';
        
        const encouragement = this.correctAnswers === 5 ? 
            "Perfect score! Amazing!" : 
            "Great job!";
        
        this.speak(`Level complete! ${summary} ${encouragement} Say start game to play again.`);
        this.startBtn.style.display = 'inline-block';
        this.startBtn.textContent = 'Play Again';
    }
    
    endGame() {
        this.questionText.textContent = `Game Complete! Score: ${this.score}`;
        this.answerOptions.innerHTML = '';
        this.feedback.textContent = "Well done!";
        this.feedback.className = 'feedback correct';
        
        this.speak(`Game complete! Your score is ${this.score}. Say start game to play again.`);
        this.startBtn.style.display = 'inline-block';
        this.startBtn.textContent = 'Play Again';
    }
    
    disableOptions() {
        const options = document.querySelectorAll('.option-btn');
        options.forEach(btn => btn.disabled = true);
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
    }
    
    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        this.voiceToggle.textContent = this.voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off';
        
        if (this.voiceEnabled) {
            this.startRecognition();
            this.speak('Voice enabled');
        } else {
            if (this.recognition) {
                this.recognition.stop();
            }
            this.speak('Voice disabled');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameDashboard();
});