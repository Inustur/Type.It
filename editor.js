// Initialize Quill editor
var quill = new Quill('#editor', { theme: 'snow' });

// Toggle editor visibility
document.getElementById('toggle').onclick = () => {
  let ed = document.getElementById('editor');
  ed.style.display = ed.style.display === 'none' ? 'block' : 'none';
};
