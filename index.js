document.addEventListener('DOMContentLoaded', () => {
  const arrow = document.getElementById('scroll-arrow');

  // Smooth scroll hero
  if (arrow) {
    arrow.addEventListener('click', () => {
      document.querySelector('header')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
function megaphoneRain(duration = 3000, frequency = 100) {
  const container = document.createElement('div');
  container.className = 'megaphone-confetti';
  document.body.appendChild(container);

  const iconUnicode = '📣';

  const interval = setInterval(() => {
    const icon = document.createElement('div');
    icon.className = 'megaphone-icon';
    icon.style.left = Math.random() * 100 + 'vw';
    icon.style.fontSize = (16 + Math.random() * 24) + 'px';
    icon.style.animationDuration = (2 + Math.random() * 2) + 's';
    icon.innerHTML = iconUnicode;
    container.appendChild(icon);

    setTimeout(() => {
      icon.remove();
    }, 4000); 
  }, frequency);

  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => container.remove(), 4000); 
  }, duration);
}

quizzResult.addEventListener('click', () => {
  megaphoneRain(3000, 100); // 3s, toutes les 100ms
});

  // Quizz
  const quizzForm = document.getElementById('quizz-form');
  const quizzResult = document.getElementById('quizz-result');

  if (quizzForm) {
    quizzForm.addEventListener('submit', e => {
      e.preventDefault();
      const q1 = quizzForm.q1.value;
      const q2 = quizzForm.q2.value;
      const q3 = quizzForm.q3.value;
      const q4 = quizzForm.q4.value;

      const votes = {
        "Futur⸱e Directeur⸱ice du pôle plaidoyer": 0,
        "Initiateur⸱ice de projet": 0,
        "Lobbyiste": 0
      };

      votes[q1] += 1;
      votes[q2] += 1;
      votes[q3] += 1;
      votes[q4] += 1;

      const result = Object.keys(votes).reduce((a,b) => votes[a]>votes[b]?a:b);

      const descriptions = {
        "Futur⸱e Directeur⸱ice du pôle plaidoyer": "Tu vas prendre ma place ! Tu aimes organiser, planifier et guider ! Tu es un élément clé de la team plaidoyer.",
        "Initiateur⸱ice de projet": "Tu débordes d'idées et es avide de connaissances ! Ta créativité est ta force.",
        "Lobbyiste": "Tu es excellent·e pour convaincre et communiquer ! Ton rôle est essentiel pour faire aboutir nos plaidoyers."
      };

      const images = {
        "Futur⸱e Directeur⸱ice du pôle plaidoyer": "directeur.jpg",
        "Initiateur⸱ice de projet": "initiateur.png",
        "Lobbyiste": "lobbyiste.png"
      };

      quizzResult.innerHTML = `
        <div class="quizz-result-block">
          <h3>Tu es : <strong>${result}</strong> ! 🎉</h3>
          <p>${descriptions[result]}</p>
          <img src="${images[result]}" alt="${result}" class="quizz-result-image"/>
  </div>
      `;
    });
  }

  // Projects to Email
  const projectsForm = document.getElementById('projects-form');
  if (projectsForm) {
    projectsForm.addEventListener('submit', ev => {
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
        `Adresse e-mail: ${email}`,
        '',
        'Message envoyé depuis le formulaire du site JAC.'
      ];
      const mailBody = encodeURIComponent(bodyLines.join('\n'));
      const mailto = `mailto:${to}?subject=${encodeURIComponent(mailSubj)}&body=${mailBody}`;
      try { window.location.href = mailto; } 
      catch { window.open(mailto); }
    });
  }

  // Perso speaking
  const image = document.querySelector('.femme');
  function Bottom() { return (window.innerHeight + window.scrollY) >= document.body.offsetHeight-80; }
  function updateImageText() { 
    if (Bottom()) {
    image.src = "femmeparle.png";
  } else {
    image.src = "femme.png";
  }
  }
  window.addEventListener('scroll', updateImageText);
});




