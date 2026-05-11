// Add random floating doodles to the background
const doodles = ['⭐', '🌀', '✏️', '✨', '👀', '🔥', '⚡️', '🪐'];
const body = document.querySelector('body');

for (let i = 0; i < 15; i++) {
  const doodle = document.createElement('div');
  doodle.classList.add('doodle');
  doodle.innerText = doodles[Math.floor(Math.random() * doodles.length)];
  
  // Random placement
  doodle.style.left = `${Math.random() * 90}vw`;
  doodle.style.top = `${Math.random() * 90}vh`;
  
  // Random animation delay
  doodle.style.animationDelay = `${Math.random() * 2}s`;
  
  body.appendChild(doodle);
}

// Page transition logic (fade out before navigating)
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.href;
    document.body.style.animation = 'none';
    document.body.style.opacity = '1';
    
    // Fake loading transition
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
      window.location.href = target;
    }, 300);
  });
});

// Goofy submit button logic for the Apply page
const submitBtn = document.getElementById('submit-btn');
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitBtn.innerText = "Exploding in 3... 2... 💥";
    setTimeout(() => {
      submitBtn.innerText = "Just kidding! Applied! ✅";
      submitBtn.style.background = "#a3d2ff";
    }, 2000);
  });
}