/**
 * questionnaire.js
 * Validation JavaScript pour la page Questionnaire — InternShip Manager
 * Membres : [Votre Groupe]
 * ENSI 2025/2026 — Partie III
 */

/* ============================================================
   FONCTIONS DE VALIDATION
   ============================================================ */

/**
 * Valide que le champ n'est pas vide
 * @param {string} valeur
 * @returns {boolean}
 */
function validerNonVide(valeur) {
  return valeur.trim().length > 0;
}

/**
 * Valide le format d'un email
 * @param {string} email
 * @returns {boolean}
 */
function validerEmail(email) {
  // Expression régulière basique pour un email valide
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valide qu'au moins un radio est sélectionné dans un groupe
 * @param {string} nomGroupe - Attribut name des radio buttons
 * @returns {boolean}
 */
function validerRadio(nomGroupe) {
  var radios = document.querySelectorAll('input[name="' + nomGroupe + '"]');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) return true;
  }
  return false;
}

/**
 * Valide qu'au moins une case à cocher d'un groupe est cochée
 * @param {string} nomGroupe - Attribut name des checkboxes
 * @returns {boolean}
 */
function validerCheckbox(nomGroupe) {
  var boxes = document.querySelectorAll('input[name="' + nomGroupe + '"]:checked');
  return boxes.length > 0;
}

/**
 * Valide que le textarea contient au moins N caractères
 * @param {string} valeur
 * @param {number} min
 * @returns {boolean}
 */
function validerLongueur(valeur, min) {
  return valeur.trim().length >= min;
}

/* ============================================================
   AFFICHAGE DES ERREURS / SUCCÈS
   ============================================================ */

/**
 * Affiche un message d'erreur sous un champ
 * @param {string} idErreur - ID de l'élément d'erreur
 * @param {string} message
 */
function afficherErreur(idErreur, message) {
  var el = document.getElementById(idErreur);
  if (el) {
    el.textContent = message;
    el.style.display = "block";
  }
}

/**
 * Masque le message d'erreur d'un champ
 * @param {string} idErreur
 */
function masquerErreur(idErreur) {
  var el = document.getElementById(idErreur);
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
}

/* ============================================================
   VALIDATION PRINCIPALE DU FORMULAIRE
   ============================================================ */

/**
 * Valide l'ensemble du formulaire questionnaire
 * @returns {boolean} true si le formulaire est valide
 */
function validerFormulaire() {
  var estValide = true;

  /* --- Champ 1 : Nom --- */
  var nom = document.getElementById("q-nom").value;
  if (!validerNonVide(nom)) {
    afficherErreur("err-nom", "⚠️ Le nom est obligatoire.");
    estValide = false;
  } else {
    masquerErreur("err-nom");
  }

  /* --- Champ 2 : Email --- */
  var email = document.getElementById("q-email").value;
  if (!validerNonVide(email)) {
    afficherErreur("err-email", "⚠️ L'email est obligatoire.");
    estValide = false;
  } else if (!validerEmail(email)) {
    afficherErreur("err-email", "⚠️ Format d'email invalide (ex: nom@domaine.tn).");
    estValide = false;
  } else {
    masquerErreur("err-email");
  }

  /* --- Champ 3 : Satisfaction (radio) --- */
  if (!validerRadio("satisfaction")) {
    afficherErreur("err-satisfaction", "⚠️ Veuillez sélectionner votre niveau de satisfaction.");
    estValide = false;
  } else {
    masquerErreur("err-satisfaction");
  }

  /* --- Champ 4 : Fonctionnalités utilisées (checkbox) --- */
  if (!validerCheckbox("fonctionnalites")) {
    afficherErreur("err-fonctionnalites", "⚠️ Veuillez cocher au moins une fonctionnalité.");
    estValide = false;
  } else {
    masquerErreur("err-fonctionnalites");
  }

  /* --- Champ 5 : Commentaire (textarea, minimum 20 caractères) --- */
  var commentaire = document.getElementById("q-commentaire").value;
  if (!validerLongueur(commentaire, 20)) {
    afficherErreur("err-commentaire", "⚠️ Le commentaire doit contenir au moins 20 caractères.");
    estValide = false;
  } else {
    masquerErreur("err-commentaire");
  }

  return estValide;
}

/* ============================================================
   INITIALISATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  var formulaire = document.getElementById("form-questionnaire");
  if (!formulaire) return;

  /* Validation à la soumission du formulaire */
  formulaire.addEventListener("submit", function (e) {
    e.preventDefault(); // Empêcher l'envoi par défaut

    if (validerFormulaire()) {
      // Formulaire valide : afficher le message de succès
      var succes = document.getElementById("msg-succes");
      if (succes) succes.style.display = "block";
      formulaire.style.display = "none";
    }
  });

  /* Validation en temps réel sur l'email */
  var champEmail = document.getElementById("q-email");
  if (champEmail) {
    champEmail.addEventListener("blur", function () {
      var email = champEmail.value;
      if (validerNonVide(email) && !validerEmail(email)) {
        afficherErreur("err-email", "⚠️ Format d'email invalide.");
      } else {
        masquerErreur("err-email");
      }
    });
  }

  /* Validation en temps réel sur le commentaire */
  var champCommentaire = document.getElementById("q-commentaire");
  if (champCommentaire) {
    champCommentaire.addEventListener("input", function () {
      var restants = 20 - champCommentaire.value.trim().length;
      var compteur = document.getElementById("compteur-commentaire");
      if (compteur) {
        compteur.textContent = restants > 0
          ? "Encore " + restants + " caractères minimum"
          : "✅ Longueur suffisante";
        compteur.style.color = restants > 0 ? "var(--orange)" : "var(--green)";
      }
    });
  }
});
