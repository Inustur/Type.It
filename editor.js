// Initialize Quill editor
var quill = new Quill('#editor', { theme: 'snow' });

// Store previous typing timestamp
let lastTime = Date.now();

// Listen for typing activity
quill.on('text-change', function (delta, oldDelta, source) {
  if (source === 'user') {
    const now = Date.now();
    const speed = now - lastTime; // time gap between keystrokes
    lastTime = now;

    // Get the last typed word
    const text = quill.getText().trim();
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    const wordLength = lastWord.length;

    // Send data to p5.js (only if the function exists)
    if (typeof window.addShape === 'function') {
      window.addShape(speed, wordLength);
    }
  }
});

// Toggle editor + prompt visibility
document.getElementById('toggle').onclick = () => {
  const container = document.getElementById('editor-container');
  container.style.display =
    container.style.display === 'none' ? 'flex' : 'none';
};
