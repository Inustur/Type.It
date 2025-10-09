//initialize Quill editor
var quill = new Quill('#editor', { 
  theme: 'snow',
  placeholder: 'Start typing here!' 
});

//tracking last time for typing speed
let lastTime = Date.now();

const toggleBtn = document.getElementById('toggle');
const editorContainer = document.getElementById('editor-container');
const canvasContainer = document.getElementById('canvas-container');
let editorVisible = true;

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
  const isSpace = char === ' ';
  const isEnter = char === '\n';

  if (typeof window.addVisual === "function") {
    window.addVisual({ char, speed, isVowel, isConsonant, isNumber, isPunct, isEnter, isSpace });
  }
});

//toggle editor visibility
toggleBtn.onclick = () => {
  editorVisible = !editorVisible;

  if (editorVisible) {
    //show editor again
    editorContainer.style.display = 'flex';
    canvasContainer.classList.remove('fullscreen');
    resizeCanvas(windowWidth / 1.35, windowHeight); //ensure resize working properly at 35-65
  } else {
    //hide editor and expand canvas
    editorContainer.style.display = 'none';
    canvasContainer.classList.add('fullscreen');
    resizeCanvas(windowWidth, windowHeight);
  }
};