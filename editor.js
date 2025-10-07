//initialize Quill editor
var quill = new Quill('#editor', { theme: 'snow' });

//tracking last time for typing speed
let lastTime = Date.now();

//listener for text input event
quill.on('text-change', function (delta, oldDelta, source) {
  if (source !== 'user') return;

  const now = Date.now();
  const speed = now - lastTime;
  lastTime = now;

  //get last inserted character
  let lastInsert = "";
  delta.ops.forEach(op => {
    if (op.insert) {
      lastInsert += op.insert;
    }
  });

  if (lastInsert.length === 0) return;

  const char = lastInsert.slice(-1);
  const isVowel = /[aeiouAEIOU]/.test(char);
  const isConsonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/.test(char);
  const isNumber = /[0-9]/.test(char);
  const isPunct = /[.,!?;:'"()]/.test(char);
  const isEnter = char === '\n';

  if (typeof window.addVisual === "function") {
    window.addVisual({ char, speed, isVowel, isConsonant, isNumber, isPunct, isEnter });
  }
});

//toggle editor visibility
document.getElementById('toggle').onclick = () => {
  const container = document.getElementById('editor-container');
  container.style.display = container.style.display === 'none' ? 'flex' : 'none';
};
