document.addEventListener('DOMContentLoaded', () => {
  // Tab
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');

      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Arrow
  const hero = document.getElementById('hero');
  const arrow = document.getElementById('scroll-arrow');
  if (!hero || !arrow) return;

  function onHeroAnimationEnd(e) {
    setTimeout(() => {
      arrow.classList.add('flash-once');
    }, 300);
    hero.removeEventListener('animationend', onHeroAnimationEnd);
  }
  hero.addEventListener('animationend', onHeroAnimationEnd);

  // Scroll
  arrow.addEventListener('click', () => {
    const header = document.querySelector('header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Form
  const projectsForm = document.getElementById('projects-form');
  if (projectsForm) {
    projectsForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const subj = document.getElementById('subject')?.value.trim() || '';
      const event = document.getElementById('event')?.value.trim() || '';
      const com = document.getElementById('com')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const to = 'adele.ungria@jac-asso.fr';
      const mailSubj = `Intérêt projet: ${subj || 'Sans sujet'}`;
      const bodyLines = [
        `Sujet: ${subj}`,
        `Événement: ${event}`,
        `Commentaire: ${com}`,
        `Adresse e‑mail: ${email}`,
        '',
        'Message envoyé depuis le formulaire du site JAC.'
      ];
      const mailBody = encodeURIComponent(bodyLines.join('\n'));
      const mailto = `mailto:${to}?subject=${encodeURIComponent(mailSubj)}&body=${mailBody}`;
      try {
        window.location.href = mailto;
      } catch (err) {
        window.open(mailto);
      }
    });
  }
});
