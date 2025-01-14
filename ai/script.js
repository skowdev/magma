import { db } from "./firebase.js";
import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


async function loadLeaderboard() {
  try {
    // Référence à la collection "leaderboard"
    const leaderboardRef = collection(db, "leaderboard");

    // Requête pour obtenir les 5 premiers classés par temps (ordre croissant)
    const q = query(leaderboardRef, orderBy("time"), limit(5));
    const querySnapshot = await getDocs(q);

    // Cibler l'élément DOM pour afficher le leaderboard
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = ""; // Réinitialiser le tableau

    // Parcourir les résultats et ajouter les lignes dans le tableau
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");

      // Colonne Nom
      const nameCell = document.createElement("td");
      nameCell.textContent = data.name;
      row.appendChild(nameCell);

      // Colonne Temps
      const timeCell = document.createElement("td");
      timeCell.textContent = data.time;
      row.appendChild(timeCell);

      leaderboardBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  gsap.set(".img", { y: 500 });
  gsap.set(".loader-imgs", { x: 500 });
  gsap.set(".nav-item", { y: 25, opacity: 0 });
  gsap.set("h1, .item, footer", { y: 200 });
  gsap.set("#hero", { opacity: 0, y: 100 });
  gsap.set("#chat-box", { opacity: 0, y: 100 });
  const tl = gsap.timeline({ delay: 1 });

  tl.to(".img", {
    y: 0,
    duration: 1.5,
    stagger: 0.05,
    ease: "power3.inOut",
  })
    .to(".loader-imgs", {
      x: 0,
      duration: 3,
      ease: "power3.inOut",
    }, "-=2.5")
    .to(".img:not(#loader-logo)", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
      ease: "power3.inOut",
    }, "-=1")
    .to(".loader", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      ease: "power3.inOut",
    }, "-=0.5")
    .to(".nav-item, h1, footer, .item", {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 1,
      ease: "power3.inOut",
    }, "-=0.5")
    .to("#hero", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.inOut",
    }, "-=0.5")
    .to("#chat-box", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.inOut",
    }, "-=0.5");

  const messageHistory = [
    { role: "system", content: 'You are Magma AI, a knowledgeable agent specializing in cybersecurity solutions for decentralized physical infrastructure networks (DePIN) and blockchain projects, particularly on the Solana network. Your goal is to:Provide clear, accurate answers to guest questions about Magma AI’s features, its role in enhancing cybersecurity, and how it integrates with Solana.Explain the concept of DePIN, its advantages, and its relevance to blockchain and cybersecurity.Assist developers, project managers, and investors by offering tailored information based on their queries, such as technical guidance, benefits of using Magma AI, and use cases.Use simple, accessible language when addressing beginners, and provide more technical details when engaging with advanced users.You must maintain professionalism, prioritize accuracy, and ensure your answers are helpful and aligned with the principles of decentralized technology and cybersecurity.' },
  ];

  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  loadLeaderboard();
  function appendMessage(role, content) {
    const chatMessages = document.getElementById("chat-messages");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", role); // Ajoute une classe en fonction du rôle (user ou bot)

    const messageContent = document.createElement("p");
    messageContent.textContent = content;

    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);

    // Scroll automatiquement vers le bas après ajout
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Ajouter un message de bienvenue
  const welcomeMessage = "Welcome to Magma AI! I’m here to help with your questions about DePIN, cybersecurity, and our role on the Solana network. Ask away!";
  appendMessage("bot", welcomeMessage);
  messageHistory.push({ role: "assistant", content: welcomeMessage }); // Ajout au contexte

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
	
    appendMessage("user", message);
    messageHistory.push({ role: "user", content: message }); // Ajout au contexte
    userInput.value = "";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR-API-KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messageHistory, // Envoi de tout l'historique
        }),
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;

      appendMessage("bot", reply);
      messageHistory.push({ role: "assistant", content: reply }); // Ajout de la réponse de l'IA à l'historique
    } catch (error) {
      const errorMessage = "Une erreur est survenue. Réessayez plus tard.";
      appendMessage("bot", errorMessage);
      messageHistory.push({ role: "assistant", content: errorMessage }); // Ajout du message d'erreur à l'historique
    }
  });
});


particlesJS("particles-js", {
  particles: {
      number: {
          value: 80,
          density: {
              enable: true,
              value_area: 800,
          },
      },
      color: { value: "#00A877" },
      shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
      },
      opacity: {
          value: 0.5,
          random: false,
          anim: { enable: false },
      },
      size: {
          value: 5,
          random: true,
          anim: { enable: false },
      },
      line_linked: {
          enable: true,
          distance: 150,
          color: "#00A877",
          opacity: 0.4,
          width: 1,
      },
      move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
      },
  },
  interactivity: {
      detect_on: "canvas",
      events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
      },
      modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8 },
          repulse: { distance: 200 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
      },
  },
  retina_detect: true,
});
var matrixAnimations = document.querySelectorAll(".matrix-animation");
var animationIds = [];
var originalTexts = [];
var currentIndex = 0;
var isAnimating = false;

for (var i = 0; i < matrixAnimations.length; i++) {
  originalTexts[i] = matrixAnimations[i].innerText;

  matrixAnimations[i].addEventListener(
    "mouseover",
    (function (i) {
      return function () {
        if (isAnimating) return;

        isAnimating = true;
        currentIndex = 0;
        animateText(matrixAnimations[i], originalTexts[i]);
      };
    })(i)
  );

  matrixAnimations[i].addEventListener(
    "mouseout",
    (function (i) {
      return function () {
        cancelAnimationFrame(animationIds[i]);
        resetAnimation(matrixAnimations[i], originalTexts[i]);
        currentIndex = 0;
        isAnimating = false;
      };
    })(i)
  );
}

function animateText(element, originalText) {
  var characters = originalText.split("");
  var randomizedIndices = getRandomIndices(characters.length);

  var startTime = null;
  var duration = 800; // Adjust the duration as desired

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = timestamp - startTime;

    if (progress >= duration) {
      isAnimating = false;
      return;
    }

    var currentIndex = Math.floor((progress / duration) * characters.length);

    scrambleText(element, characters, randomizedIndices, currentIndex);
    animationIds[i] = requestAnimationFrame(animate);
  }

  animationIds[i] = requestAnimationFrame(animate);
}

function scrambleText(element, characters, randomizedIndices, currentIndex) {
  var scrambledText = "";

  for (var i = 0; i < characters.length; i++) {
    if (i <= currentIndex || characters[i] === " ") {
      scrambledText += characters[i];
    } else {
      var randomIndex = randomizedIndices[i];
      scrambledText += String.fromCharCode(Math.floor(Math.random() * 94) + 33);
    }
  }

  element.innerText = scrambledText;
}

function resetAnimation(element, originalText) {
  element.innerText = originalText;
}

function getRandomIndices(length) {
  var indices = [];

  for (var i = 0; i < length; i++) {
    indices.push(i);
  }

  shuffleArray(indices);
  return indices;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
