/**
 * funpage.js
 * Jeu interactif "Attrape le Stage" + démonstration de la propagation des événements
 * InternShip Manager — ENSI 2025/2026 — Partie III
 * Membres : [Votre Groupe]
 *
 * Concepts utilisés :
 *   - Manipulation du DOM (createElement, appendChild, removeChild)
 *   - addEventListener() pour gérer les interactions (clic, clavier)
 *   - Event Bubbling : propagation sur 3 niveaux imbriqués
 *   - event.stopPropagation() pour bloquer la propagation
 *   - setInterval / clearInterval pour le timer
 *   - Positionnement aléatoire des cibles
 */

/* ============================================================
   PARTIE 1 : JEU — ATTRAPE LE STAGE
   ============================================================ */

/** Émojis représentant différentes offres de stage */
var OFFRES = ["💼", "🏢", "📋", "🎓", "💻", "📊", "🔬", "🎨", "🚀", "⚙️"];

/** État du jeu */
var etatJeu = {
  score:    0,     // Points obtenus
  rates:    0,     // Cibles ratées (disparues sans être cliquées)
  temps:    30,    // Secondes restantes
  enCours:  false, // Le jeu tourne-t-il ?
  enPause:  false  // Le jeu est-il en pause ?
};

/** Références aux intervalles */
var intervalTimer  = null; // Timer du compte à rebours
var intervalCible  = null; // Apparition des cibles
var ciblesActives  = [];   // Liste des éléments cible dans le DOM

/**
 * Affiche un nombre aléatoire entre min et max inclus
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Met à jour l'affichage du score, du timer et des ratés
 */
function mettreAJourAffichage() {
  document.getElementById("score-val").textContent = etatJeu.score;
  document.getElementById("timer-val").textContent = etatJeu.temps;
  document.getElementById("rate-val").textContent  = etatJeu.rates;
}

/**
 * Crée et positionne une cible (offre de stage) de manière aléatoire dans le terrain
 */
function creerCible() {
  if (!etatJeu.enCours || etatJeu.enPause) return;

  var terrain = document.getElementById("jeu-terrain");
  if (!terrain) return;

  // Créer l'élément cible
  var cible = document.createElement("div");
  cible.className = "cible";
  cible.textContent = OFFRES[random(0, OFFRES.length - 1)];

  // Position aléatoire dans les limites du terrain
  var maxX = terrain.offsetWidth  - 50;
  var maxY = terrain.offsetHeight - 50;
  cible.style.left = random(10, maxX) + "px";
  cible.style.top  = random(10, maxY) + "px";

  terrain.appendChild(cible);
  ciblesActives.push(cible);

  // Durée de vie de la cible : 1.5 à 2.5 secondes
  var dureeVie = random(1500, 2500);

  var timerCible = setTimeout(function () {
    // La cible disparaît sans être cliquée → raté !
    if (cible.parentNode) {
      afficherMiss(cible); // Effet visuel "raté"
      cible.parentNode.removeChild(cible);
      ciblesActives = ciblesActives.filter(function (c) { return c !== cible; });
      if (etatJeu.enCours) {
        etatJeu.rates++;
        mettreAJourAffichage();
      }
    }
  }, dureeVie);

  /* --- Gestionnaire de clic sur la cible (addEventListener) --- */
  cible.addEventListener("click", function (e) {
    // Empêcher le clic de se propager vers le terrain
    e.stopPropagation();

    // Annuler la disparition automatique
    clearTimeout(timerCible);

    // Animation "pop" avant suppression
    cible.classList.add("pop");

    setTimeout(function () {
      if (cible.parentNode) {
        cible.parentNode.removeChild(cible);
        ciblesActives = ciblesActives.filter(function (c) { return c !== cible; });
      }
    }, 300);

    // Ajouter des points
    etatJeu.score += 10;
    mettreAJourAffichage();
  });
}

/**
 * Affiche un effet visuel "raté" à la position d'une cible disparue
 * @param {HTMLElement} cible
 */
function afficherMiss(cible) {
  var terrain = document.getElementById("jeu-terrain");
  if (!terrain) return;

  var miss = document.createElement("div");
  miss.className = "miss-effect";
  miss.textContent = "❌";
  miss.style.left = cible.style.left;
  miss.style.top  = cible.style.top;
  terrain.appendChild(miss);

  // Supprimer l'effet après l'animation
  setTimeout(function () {
    if (miss.parentNode) miss.parentNode.removeChild(miss);
  }, 600);
}

/**
 * Démarre le jeu
 */
function demarrerJeu() {
  // Réinitialiser l'état
  etatJeu.score   = 0;
  etatJeu.rates   = 0;
  etatJeu.temps   = 30;
  etatJeu.enCours = true;
  etatJeu.enPause = false;

  // Nettoyer le terrain
  var terrain = document.getElementById("jeu-terrain");
  terrain.innerHTML = "";
  ciblesActives = [];

  // Cacher le message de fin
  document.getElementById("fin-message").style.display = "none";

  // Mettre à jour l'affichage
  mettreAJourAffichage();

  // Activer/désactiver les boutons
  document.getElementById("btn-demarrer").disabled = true;
  document.getElementById("btn-pause").disabled    = false;
  document.getElementById("btn-stop").disabled     = false;

  /* --- Timer : compte à rebours (toutes les secondes) --- */
  intervalTimer = setInterval(function () {
    if (!etatJeu.enPause) {
      etatJeu.temps--;
      mettreAJourAffichage();

      if (etatJeu.temps <= 0) {
        finJeu();
      }
    }
  }, 1000);

  /* --- Apparition des cibles (toutes les 800 ms) --- */
  intervalCible = setInterval(function () {
    creerCible();
  }, 800);
}

/**
 * Met le jeu en pause ou le reprend
 */
function basculerPause() {
  if (!etatJeu.enCours) return;

  etatJeu.enPause = !etatJeu.enPause;
  var btn = document.getElementById("btn-pause");

  if (etatJeu.enPause) {
    btn.textContent = "▶️ Reprendre";
    // Masquer les cibles pendant la pause
    ciblesActives.forEach(function (c) { c.style.visibility = "hidden"; });
  } else {
    btn.textContent = "⏸️ Pause";
    ciblesActives.forEach(function (c) { c.style.visibility = "visible"; });
  }
}

/**
 * Arrête le jeu et affiche le message de fin
 */
function finJeu() {
  etatJeu.enCours = false;

  // Arrêter les intervalles
  clearInterval(intervalTimer);
  clearInterval(intervalCible);

  // Supprimer les cibles restantes
  var terrain = document.getElementById("jeu-terrain");
  terrain.innerHTML = "";
  ciblesActives = [];

  // Réactiver les boutons
  document.getElementById("btn-demarrer").disabled = false;
  document.getElementById("btn-pause").disabled    = true;
  document.getElementById("btn-stop").disabled     = true;
  document.getElementById("btn-pause").textContent = "⏸️ Pause";

  // Déterminer le message selon le score
  var msg = "";
  if (etatJeu.score >= 150)      msg = "🏆 Excellent ! Tu es un chasseur de stages né !";
  else if (etatJeu.score >= 80)  msg = "👍 Bien joué ! Tu as de bons réflexes !";
  else if (etatJeu.score >= 30)  msg = "😅 Pas mal ! Continue à t'entraîner !";
  else                            msg = "😬 Il te faut plus de pratique... essaie encore !";

  // Afficher le message de fin
  var fin = document.getElementById("fin-message");
  var texte = document.getElementById("fin-texte");
  texte.innerHTML =
    "Score final : <strong>" + etatJeu.score + " points</strong><br>" +
    "Offres ratées : " + etatJeu.rates + "<br><br>" + msg;
  fin.style.display = "block";
}

/* ============================================================
   PARTIE 2 : PROPAGATION DES ÉVÉNEMENTS (Event Bubbling)
   ============================================================ */

/** Journal des événements de propagation */
var logEntrees = [];

/**
 * Ajoute une entrée dans le journal de propagation
 * @param {string} message  - Message à afficher
 * @param {string} classe   - Classe CSS pour la couleur
 */
function ajouterLog(message, classe) {
  var log = document.getElementById("log-propagation");
  if (!log) return;

  // Créer la ligne de log
  var entry = document.createElement("div");
  entry.className = "log-entry " + classe;
  entry.textContent = "→ " + message;
  log.appendChild(entry);

  // Faire défiler vers le bas
  log.scrollTop = log.scrollHeight;

  // Sauvegarder pour référence
  logEntrees.push(message);
}

/**
 * Vide le journal de propagation
 */
function viderLog() {
  var log = document.getElementById("log-propagation");
  if (log) {
    log.innerHTML = '<div class="log-entry" style="color:#888;">— Journal vidé —</div>';
  }
  logEntrees = [];
}

/* ============================================================
   INITIALISATION — Chargement de la page
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* --- Boutons du jeu --- */

  // Démarrer
  var btnDemarrer = document.getElementById("btn-demarrer");
  if (btnDemarrer) {
    btnDemarrer.addEventListener("click", function () {
      demarrerJeu();
    });
  }

  // Pause
  var btnPause = document.getElementById("btn-pause");
  if (btnPause) {
    btnPause.addEventListener("click", function () {
      basculerPause();
    });
  }

  // Stop
  var btnStop = document.getElementById("btn-stop");
  if (btnStop) {
    btnStop.addEventListener("click", function () {
      if (etatJeu.enCours) finJeu();
    });
  }

  // Rejouer
  var btnRejouer = document.getElementById("btn-rejouer");
  if (btnRejouer) {
    btnRejouer.addEventListener("click", function () {
      demarrerJeu();
    });
  }

  /* --- Clic raté sur le terrain (pas sur une cible) --- */
  var terrain = document.getElementById("jeu-terrain");
  if (terrain) {
    terrain.addEventListener("click", function () {
      if (etatJeu.enCours && !etatJeu.enPause) {
        // Pénalité : clic dans le vide
        etatJeu.score = Math.max(0, etatJeu.score - 2);
        mettreAJourAffichage();
      }
    });
  }

  /* --- Raccourci clavier : Espace = démarrer/pause --- */
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!etatJeu.enCours) {
        demarrerJeu();
      } else {
        basculerPause();
      }
    }
  });

  /* ============================================================
     PROPAGATION DES ÉVÉNEMENTS — 3 niveaux imbriqués
     ============================================================ */

  /**
   * NIVEAU 1 : Zone extérieure (DIV)
   * Cet écouteur reçoit tous les clics qui remontent (bubble up) depuis les enfants,
   * SAUF ceux bloqués par stopPropagation()
   */
  var zonePropagation = document.getElementById("zone-propagation");
  if (zonePropagation) {
    zonePropagation.addEventListener("click", function () {
      ajouterLog(
        "[Niveau 1] Zone Extérieure (DIV) a reçu l'événement click",
        "log-div"
      );
    });
  }

  /**
   * NIVEAU 2 : Zone de jeu (DIV enfant)
   * Reçoit les clics de son propre espace et de ses enfants (sauf si stoppé)
   */
  var zoneJeu = document.getElementById("zone-jeu");
  if (zoneJeu) {
    zoneJeu.addEventListener("click", function () {
      ajouterLog(
        "[Niveau 2] Zone de Jeu (DIV) a reçu l'événement click",
        "log-jeu"
      );
      // NE PAS appeler stopPropagation() ici → l'événement continue à remonter
    });
  }

  /**
   * NIVEAU 3 : Élément interactif (bouton)
   * Utilise event.stopPropagation() pour BLOQUER la remontée de l'événement
   * → Les niveaux 1 et 2 NE recevront PAS ce clic
   */
  var elementInteractif = document.getElementById("element-interactif");
  if (elementInteractif) {
    elementInteractif.addEventListener("click", function (e) {

      // ⚡ ARRÊT DE LA PROPAGATION : l'événement ne remontera pas aux parents
      e.stopPropagation();

      ajouterLog(
        "[Niveau 3] Bouton Interactif a reçu l'événement click → stopPropagation() appelé ! Les niveaux 1 et 2 ne verront pas ce clic.",
        "log-btn"
      );
    });
  }

  /* --- Bouton Vider le journal --- */
  var btnViderLog = document.getElementById("btn-vider-log");
  if (btnViderLog) {
    btnViderLog.addEventListener("click", function () {
      viderLog();
    });
  }

});
