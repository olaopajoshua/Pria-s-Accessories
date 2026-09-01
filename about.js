/**
 * PRIA'S ACCESSORIES — ABOUT / THE STUDIO JAVASCRIPT (about.html)
 * Studio page interactions and smooth presentation
 */

document.addEventListener('DOMContentLoaded', () => {
  initAboutPage();
});

function initAboutPage() {
  // Setup smooth scroll for any internal anchors if present
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
