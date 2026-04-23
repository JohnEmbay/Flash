// Flashcard App - Micro-Learning Tool
// Handles all CRUD operations, state management, and UI updates

class FlashcardApp {
    constructor() {
        this.cards = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.updateTotalCards();
        this.bindEvents();
        this.showSection();
    }

    bindEvents() {
        // Form submission
        document.getElementById('card-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCard();
        });

        // Study mode buttons
        document.getElementById('flip-btn').addEventListener('click', () => this.flipCard());
        document.getElementById('next-btn').addEventListener('click', () => this.nextCard());
        document.getElementById('mark-learned-btn').addEventListener('click', () => this.markLearned());
        document.getElementById('shuffle-btn').addEventListener('click', () => this.shuffleCards());
        document.getElementById('reset-progress-btn').addEventListener('click', () => this.resetProgress());

        // Listen for study section visibility change
        const observer = new MutationObserver(() => {
            if (document.getElementById('study-section').classList.contains('active')) {
                this.displayCurrentCard();
            }
        });
        observer.observe(document.getElementById('study-section'), { attributes: true, attributeFilter: ['class'] });
    }

    addCard() {
        const term = document.getElementById('term').value.trim();
        const definition = document.getElementById('definition').value.trim();

        if (!term || !definition) return;

        this.cards.push({
            id: Date.now(),
            term,
            definition,
            learned: false
        });

        this.saveToLocalStorage();
        this.updateTotalCards();
        this.resetForm();
        this.displayCurrentCard();
    }

    flipCard() {
        this.isFlipped = !this.isFlipped;
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');
    }

    nextCard() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.isFlipped = false;
        document.getElementById('flashcard').classList.remove('flipped');
        this.displayCurrentCard();
    }

    markLearned() {
        if (this.cards.length === 0) return;
        this.cards[this.currentIndex].learned = true;
        this.saveToLocalStorage();
        this.updateProgress();
        this.nextCard();
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        this.currentIndex = 0;
        this.displayCurrentCard();
    }

    resetProgress() {
        this.cards.forEach(card => card.learned = false);
        this.saveToLocalStorage();
        this.updateProgress();
    }

    displayCurrentCard() {
        if (this.cards.length === 0) {
            document.getElementById('current-card-info').textContent = 'No cards available. Add some flashcards first!';
            document.getElementById('flashcard').style.display = 'none';
            return;
        }

        document.getElementById('flashcard').style.display = 'block';
        const card = this.cards[this.currentIndex];
        
        document.getElementById('term-display').textContent = card.term;
        document.getElementById('definition-display').textContent = card.definition;
        
        const learnedStatus = card.learned ? '✅ Learned' : `Card ${this.currentIndex + 1} of ${this.cards.length}`;
        document.getElementById('current-card-info').textContent = learnedStatus;
    }

    updateProgress() {
        const total = this.cards.length;
        const learned = this.cards.filter(card => card.learned).length;
        const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;
        
        document.getElementById('progress-text').textContent = `${percentage}% Mastered`;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    updateTotalCards() {
        document.getElementById('total-cards').textContent = `Total Cards: ${this.cards.length}`;
        this.updateProgress();
    }

    resetForm() {
        document.getElementById('term').value = '';
        document.getElementById('definition').value = '';
    }

    showSection() {
        // Auto-show study section if cards exist
        if (this.cards.length > 0) {
            document.getElementById('add-card-section').classList.remove('active');
            document.getElementById('study-section').classList.add('active');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('flashcards', JSON.stringify(this.cards));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('flashcards');
        if (saved) {
            this.cards = JSON.parse(saved);
        }
    }
}

// Initialize app
const app = new FlashcardApp();

// Toggle between sections (for completeness, though auto-managed)
document.addEventListener('click', (e) => {
    if (e.target.matches('#add-card-section *')) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById('add-card-section').classList.add('active');
    }
});
