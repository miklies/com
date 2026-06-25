document.addEventListener('DOMContentLoaded', () => {
  // Active nav state
  const links = document.querySelectorAll('.nav-links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Page-exit transition
  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.28s ease';
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 280);
      }
    });
  });
});
