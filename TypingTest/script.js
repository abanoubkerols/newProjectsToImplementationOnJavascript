const words = [
    "abandon", "beacon", "candy", "dove", "eagle", "flame", "grape", "happy", "ice", "jungle",
    "kingdom", "lunar", "mango", "noble", "ocean", "petal", "quest", "river", "shadow", "train",
    "umbrella", "vivid", "whale", "basket", "yellow", "zebra", "angel", "brave", "crane", "dusk",
    "enigma", "frost", "glow", "honey", "index", "juice", "knight", "lunar", "magic", "night",
    "oasis", "pearl", "quill", "rose", "scent", "tiger", "unity", "vortex", "wind", "xray",
    "yogurt", "zoned", "atlas", "bliss", "cider", "dawn", "epoch", "flame", "gauge", "heaven",
    "irony", "jolly", "koala", "lamb", "mint", "neon", "opal", "plum", "quartz", "ruby",
    "sunset", "tango", "urban", "vogue", "wave", "xerox", "yearn", "zephyr", "aqua", "bold",
    "crisp", "dove", "edge", "forge", "grace", "hush", "ink", "jade", "kite", "leaf",
    "mist", "navy", "oak", "pale", "quilted", "rare", "stone", "tone", "urban", "vibes",
    "wisp", "yacht", "zeal", "arc", "blaze", "core", "dust", "echo", "flint", "gaze",
    "halo", "iron", "june", "kale", "lime", "moss", "nest", "ore", "peach", "quail",
    "ridge", "snow", "tide", "use", "vow", "window", "xmas", "yoga", "zoo", "amber",
    "breeze", "clover", "drift", "enjoy", "flame", "grin", "hatch", "icicle", "jazz", "knack",
    "latch", "mocha", "nail", "open", "pale", "quiz", "rust", "sail", "tide", "ugly",
    "vowed", "wool", "xenon", "yawned", "zone", "awe", "belt", "charm", "dome", "elixir",
    "fawn", "gala", "hop", "inc", "june", "knot", "lump", "moon", "noon", "opal",
    "pier", "quiver", "ride", "stare", "twin", "unit", "vase", "wax", "yolk", "zoom",
    "arrow", "brick", "cloud", "dune", "eagle", "frost", "grip", "haze", "ignite", "jacket",
    "lure", "mesh", "nest", "ogre", "puff", "quilt", "rave", "swoop", "track", "urge",
    "view", "windy", "yell", "zen", "bolt", "clip", "deep", "echo", "flare", "gaze",
    "heron", "iris", "jolt", "key", "lily", "mint", "nook", "olive", "plow", "quill",
    "rust", "sage", "tick", "uniform", "vibe", "whip", "yarn", "zoomed", "art", "blow",
    "core", "dove", "eagle", "foam", "gloom", "hand", "ice", "joke", "knee", "loaf",
    "melt", "note", "open", "pale", "quill", "roar", "slug", "tear", "urge", "blank",
    "wait", "yawn", "zinc"
];

const textContainer = document.getElementById('text-container');
const timerElement = document.getElementById('timer');
const tryAgainButton = document.getElementById('try-again');
const finalScoreElement = document.getElementById('final-score');

let totalTyped = '';
let currentCharIndex = 0;
let errors = 0;
let timeLeft = 60; // 60 seconds countdown
let timerInterval;
let typingStarted = false;
let longText = generateLongText();

// Shuffle the words array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Combine shuffled words into one long string with spaces
function generateLongText() {
    const shuffledWords = shuffleArray([...words]);
    return shuffledWords.join(' ');
}

// Start the countdown timer
function startTimer() {
    if (!typingStarted) {
        typingStarted = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endTest();
            }
        }, 1000);
    }
}

// End the test and display the final score
function endTest() {
    timerElement.textContent = `Time's up!`
    finalScoreElement.textContent = `Final WPM: ${calculateWPM()}`;
    textContainer.style.display = 'none';
    tryAgainButton.style.display = 'block';
}

// Calculate words-per-minute with error adjustment
function calculateWPM() {
    const wordsTyped = totalTyped.trim().split(/\s+/).length;
    const baseWPM = Math.round((wordsTyped / 60) * 60); // Replace first number to change time left
    const adjustedWPM = Math.max(baseWPM - errors, 0); // Ensure WPM does not go below 0
    return adjustedWPM;
}

// Handle typing over the displayed text and scrolling
document.addEventListener('keydown', (e) => {
    startTimer();

    if (e.key === 'Backspace') {
        if (totalTyped.length > 0) {
            currentCharIndex = Math.max(currentCharIndex - 1, 0);
            totalTyped = totalTyped.slice(0, -1);
        }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        totalTyped += e.key;
        currentCharIndex++;
    }

    const textArray = longText.split('');
    textContainer.innerText = '';  // Clear the existing content of textContainer

    errors = 0;  // Reset errors count for this typing session

    for (let i = 0; i < textArray.length; i++) {
        const span = document.createElement('span');

        if (i < totalTyped.length) {
            if (totalTyped[i] === textArray[i]) {
                span.classList.add('correct');
            } else {
                span.classList.add('error');
                errors++;
            }
        }
        
        span.textContent = textArray[i];
        textContainer.appendChild(span);  // Append each span element to the textContainer
    }

    // Scroll the container only after 20 characters are typed
    if (totalTyped.length >= 20) {
        const scrollAmount = (totalTyped.length - 20) * 14;  // Adjust scroll factor as needed
        textContainer.scrollLeft = scrollAmount;
    }
});

// Reset the test
function resetTest() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    finalScoreElement.textContent = '';
    textContainer.style.display = 'block';
    tryAgainButton.style.display = 'none';
    totalTyped = '';
    typingStarted = false;
    currentCharIndex = 0;
    errors = 0;
    textContainer.scrollLeft = 0; // Reset scroll position
    longText = generateLongText(); // Shuffle words and generate new text
    init();
}

// Initialize the test
function init() {
    if (isMobileDevice()) {
        showMobileMessage();
    } else {
        textContainer.innerText = longText;
        timerElement.textContent = `Time left: ${timeLeft}s`;
    }
}

// Add event listener to the try again button
tryAgainButton.addEventListener('click', resetTest);

// Detect if the device is mobile
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 800;
}

// Show message for mobile users
function showMobileMessage() {
    textContainer.textContent = 'This typing test is designed for desktop use only';
}

// Startup
init();
