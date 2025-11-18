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

  // Perso speaking
  const femmeImage = document.querySelector('.femme');
  const voirButtons = document.querySelectorAll('.btn-view');

  if (!femmeImage) {
    console.error("L'image avec la classe '.femme' n'a pas été trouvée.");
    return;
  }

  if (!voirButtons.length) {
    console.error("Aucun bouton avec la classe '.btn-view' n'a été trouvé.");
    return;
  }

  voirButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      femmeImage.src = "femmeparleCOP.png";
      console.log("Mouse entered, image should change to femmeparleCOP.png");
    });

    button.addEventListener('mouseleave', () => {
      femmeImage.src = "femme.png";
      console.log("Mouse left, image should change back to femme.png");
    });
  });
});
