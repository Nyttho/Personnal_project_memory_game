const cards = [...document.querySelectorAll(".card")];
const initGame = document.querySelector(".start");
const reset = document.querySelector(".reset");

const minutesClock = document.querySelector(".min");
const secondsClock = document.querySelector(".sec");

let showedCards = [];

let seconds = 0,
  minutes = 0;

let timeoutId;

let matchedPairs = 0;
const totalPairs = 8;

const win = document.querySelector(".win");

const shuffle = () => {
  let m = cards.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = cards[m];
    cards[m] = cards[i];
    cards[i] = t;
  }
  cards.forEach((card, index) => {
    card.style.order = index;
  });
};

const displayTime = () => {
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  secondsClock.innerText = formatTime(seconds);
  minutesClock.innerText = formatTime(minutes);
};

const startTimer = () => {
  const displaySeconds = () => {
    seconds++;
    if (seconds > 59) {
      seconds = 0;
      minutes++;
    }
    displayTime();
  };

  displayTime(); // Affichage initial des secondes

  // Utilisation d'une fonction récursive pour la mise à jour des secondes
  const timerLoop = () => {
    timeoutId = setTimeout(() => {
      displaySeconds();
      timerLoop(); // Appel récursif pour la prochaine mise à jour
    }, 1000);
  };

  timerLoop(); // Démarrer le minuteur
};

const checkWin = () => {
  if (matchedPairs === totalPairs) {
    win.style.display = "block";
    clearTimeout(timeoutId);
  }
};

const pairMatche = () => {
  matchedPairs++;
  console.log(matchedPairs);
  checkWin();
};

const compare = () => {
  if (showedCards.length === 2) {
    if (showedCards[0].innerText !== showedCards[1].innerText) {
      showedCards.forEach((card) => {
        setTimeout(() => {
          card.children[1].style.zIndex = "1";
        }, 600);
      });
    } else {
      pairMatche();
    }
    showedCards = [];
    console.log(showedCards);
  }
};

// Définition de la fonction showCard en dehors de cards.forEach
const showCard = (event) => {
  const card = event.currentTarget;
  const front = event.currentTarget.querySelector(".front");
  front.style.zIndex = "3";
  showedCards.push(card);
  compare();
};

const addClickEvent = () => {
  cards.forEach((card) => {
    card.addEventListener("click", showCard);
  });
};

const removeClickEvent = () => {
  cards.forEach((card) => {
    card.removeEventListener("click", showCard);
  });
};

// fonction pour lancer la partie
initGame.addEventListener("click", () => {
  shuffle();
  startTimer();
  addClickEvent();

  initGame.disabled = "true";
  reset.disabled = "";
  reset.addEventListener("click", resetGame);
});

// fonction pour reset la partie
const resetGame = () => {
  const front = [...document.querySelectorAll(".front")];
  front.forEach((el) => {
    el.style.zIndex = "1";
  });
  seconds = 0;
  minutes = 0;
  clearTimeout(timeoutId);
  displayTime();
  cards.forEach((card) => {
    card.removeEventListener("click", showCard);
  });
  initGame.disabled = "";
  reset.disabled = "true";
  removeClickEvent();
  showedCards = [];
  win.style.display = "none";
};
