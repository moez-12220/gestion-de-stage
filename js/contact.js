/**
 * contact.js
 * JavaScript dynamique pour la page Contact — InternShip Manager
 * Membres : [Votre Groupe]
 * ENSI 2025/2026 — Partie III
 */

/* ============================================================
   1. BANNIÈRE ANIMÉE — Message défilant avec date et heure
   ============================================================ */

/**
 * Met à jour le contenu de la bannière avec la date et l'heure actuelles
 * Appelée toutes les secondes pour garder l'heure à jour
 */
function mettreAJourBanniere() {
  var banniere = document.getElementById("banniere-texte");
  if (!banniere) return;

  // Obtenir la date et l'heure actuelles
  var maintenant = new Date();

  // Formater la date : JJ/MM/AAAA
  var jour   = String(maintenant.getDate()).padStart(2, "0");
  var mois   = String(maintenant.getMonth() + 1).padStart(2, "0");
  var annee  = maintenant.getFullYear();
  var date   = jour + "/" + mois + "/" + annee;

  // Formater l'heure : HH:MM:SS
  var heures  = String(maintenant.getHours()).padStart(2, "0");
  var minutes = String(maintenant.getMinutes()).padStart(2, "0");
  var secondes = String(maintenant.getSeconds()).padStart(2, "0");
  var heure   = heures + ":" + minutes + ":" + secondes;

  // Construire le message
  banniere.textContent =
    "🎓 Bienvenu au site web InternShip Manager ! " +
    "Aujourd'hui " + date +
    ", et l'heure actuelle est " + heure + "  •  " +
    "🎓 Bienvenu au site web InternShip Manager ! " +
    "Aujourd'hui " + date +
    ", et l'heure actuelle est " + heure;
}

/* ============================================================
   2. GALERIE D'IMAGES — Rotation automatique toutes les 3 secondes
   ============================================================ */

/** Images de la galerie (URLs d'images libres de droits sur le thème stages/université) */
var images = [
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    legende: "🎓 Étudiants en collaboration — Campus universitaire"
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
    legende: "🏢 Espace de travail moderne en entreprise"
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    legende: "💼 Équipe dynamique en réunion de projet"
  },
  {
    src: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    legende: "📚 Bibliothèque universitaire — Espace d'étude"
  }
];

var indexImageCourant = 0; // Index de l'image actuellement affichée
var intervalGalerie   = null; // Référence à l'intervalle de rotation

/**
 * Affiche l'image à l'index donné dans la galerie
 * @param {number} index - Index de l'image dans le tableau images[]
 */
function afficherImage(index) {
  var img     = document.getElementById("galerie-img");
  var legende = document.getElementById("galerie-legende");
  var dots    = document.querySelectorAll(".galerie-dot");

  if (!img) return;

  // Transition : fondu sortant
  img.style.opacity = "0";

  setTimeout(function () {
    // Changer la source de l'image
    img.src          = images[index].src;
    img.alt          = images[index].legende;
    if (legende) legende.textContent = images[index].legende;

    // Transition : fondu entrant
    img.style.opacity = "1";

    // Mettre à jour les indicateurs (dots)
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
    });
  }, 300);
}

/**
 * Passe à l'image suivante (avec bouclage)
 */
function imagesSuivante() {
  indexImageCourant = (indexImageCourant + 1) % images.length;
  afficherImage(indexImageCourant);
}

/**
 * Passe à l'image précédente (avec bouclage)
 */
function imagePrecedente() {
  indexImageCourant = (indexImageCourant - 1 + images.length) % images.length;
  afficherImage(indexImageCourant);
}

/**
 * Démarre la rotation automatique (toutes les 3 secondes)
 */
function demarrerRotation() {
  // Éviter les intervalles multiples
  if (intervalGalerie) clearInterval(intervalGalerie);
  intervalGalerie = setInterval(function () {
    imagesSuivante();
  }, 3000); // 3000 ms = 3 secondes minimum
}

/**
 * Construit dynamiquement les points indicateurs de la galerie
 */
function construireIndicateurs() {
  var conteneur = document.getElementById("galerie-dots");
  if (!conteneur) return;
  conteneur.innerHTML = "";

  images.forEach(function (_, i) {
    var dot = document.createElement("span");
    dot.className = "galerie-dot" + (i === 0 ? " active" : "");

    // Clic sur un point → aller à cette image
    dot.addEventListener("click", function () {
      indexImageCourant = i;
      afficherImage(i);
      // Redémarrer la rotation pour éviter les sauts
      demarrerRotation();
    });

    conteneur.appendChild(dot);
  });
}

/* ============================================================
   INITIALISATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* --- Bannière animée --- */
  mettreAJourBanniere();              // Affichage immédiat
  setInterval(mettreAJourBanniere, 1000); // Mise à jour chaque seconde

  /* --- Galerie d'images --- */
  construireIndicateurs();            // Créer les dots
  afficherImage(0);                   // Afficher la 1ère image
  demarrerRotation();                 // Démarrer la rotation auto

  // Bouton précédent
  var btnPrev = document.getElementById("galerie-prev");
  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      imagePrecedente();
      demarrerRotation(); // Redémarrer le timer
    });
  }

  // Bouton suivant
  var btnNext = document.getElementById("galerie-next");
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      imagesSuivante();
      demarrerRotation(); // Redémarrer le timer
    });
  }
});
