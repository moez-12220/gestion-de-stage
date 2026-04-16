/**
 * espace-etudiant.js
 * JavaScript dynamique pour la page Espace Étudiant — InternShip Manager
 * Membres : [Votre Groupe]
 * ENSI 2025/2026 — Partie III
 */

/* ============================================================
   1. DÉFINITION DU TYPE OBJET (Constructeur)
   ============================================================ */

/**
 * Constructeur Candidature
 * Représente une candidature soumise par un étudiant
 * @param {number} id        - Identifiant unique
 * @param {string} poste     - Intitulé du poste
 * @param {string} entreprise- Nom de l'entreprise
 * @param {string} date      - Date de candidature (JJ/MM/AAAA)
 * @param {string} statut    - Statut : "En cours" | "Accepté" | "Refusé"
 * @param {string} ville     - Ville du stage
 * @param {string} domaine   - Domaine du stage
 */
function Candidature(id, poste, entreprise, date, statut, ville, domaine) {
  this.id        = id;
  this.poste     = poste;
  this.entreprise = entreprise;
  this.date      = date;
  this.statut    = statut;
  this.ville     = ville;
  this.domaine   = domaine;
}

/* ============================================================
   2. INITIALISATION DU TABLEAU AVEC DONNÉES RÉELLES
   ============================================================ */

/** Tableau (array) contenant des objets Candidature */
var candidatures = [
  new Candidature(1, "Développeur Web Front-End", "TechVision SARL", "01/03/2026", "En cours",  "Tunis",    "Informatique"),
  new Candidature(2, "Designer UX/UI",            "PixelStudio",     "25/02/2026", "Accepté",   "Tunis",    "Design"),
  new Candidature(3, "Analyste Marketing",         "MediaPro",        "18/02/2026", "Refusé",    "Sousse",   "Marketing"),
  new Candidature(4, "Développeur Back-End",       "InnoSoft",        "10/03/2026", "En cours",  "Sfax",     "Informatique"),
  new Candidature(5, "Data Analyst",               "DataCore TN",     "05/03/2026", "Accepté",   "Tunis",    "Informatique")
];

/* ============================================================
   3. GÉNÉRATION DYNAMIQUE DU TABLEAU (DOM)
   ============================================================ */

/**
 * Retourne la classe CSS correspondant au statut d'une candidature
 * @param {string} statut
 * @returns {string} classe CSS
 */
function getStatutClass(statut) {
  if (statut === "Accepté") return "status-accepte";
  if (statut === "Refusé")  return "status-refuse";
  return "status-en-cours";
}

/**
 * Affiche dynamiquement les données du tableau dans la table HTML
 * @param {Array} tableau - Tableau d'objets Candidature à afficher
 */
function afficherTableau(tableau) {
  var tbody = document.getElementById("tbody-candidatures");
  if (!tbody) return;

  // Vider le tbody avant de le remplir
  tbody.innerHTML = "";

  if (tableau.length === 0) {
    // Ligne vide si aucun résultat
    var tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="7" style="text-align:center;color:var(--gray-text);padding:1.5rem;">Aucune candidature trouvée.</td>';
    tbody.appendChild(tr);
    return;
  }

  // Parcourir le tableau et créer une ligne pour chaque candidature
  for (var i = 0; i < tableau.length; i++) {
    var c  = tableau[i];
    var tr = document.createElement("tr");

    // Construction du HTML de la ligne
    tr.innerHTML =
      "<td>" + c.id + "</td>" +
      "<td>" + c.poste + "</td>" +
      "<td>" + c.entreprise + "</td>" +
      "<td>" + c.ville + "</td>" +
      "<td>" + c.domaine + "</td>" +
      "<td>" + c.date + "</td>" +
      '<td><span class="status-badge ' + getStatutClass(c.statut) + '">' + c.statut + "</span></td>";

    tbody.appendChild(tr);
  }

  // Mettre à jour le compteur
  var compteur = document.getElementById("compteur-candidatures");
  if (compteur) {
    compteur.textContent = tableau.length;
  }
}

/* ============================================================
   4a. FONCTION D'AJOUT DYNAMIQUE DE LIGNES
   ============================================================ */

/**
 * Ajoute une nouvelle candidature dans le tableau et met à jour l'affichage
 * Lit les valeurs depuis le formulaire #form-ajout-candidature
 */
function ajouterCandidature() {
  // Récupérer les valeurs du formulaire d'ajout
  var poste      = document.getElementById("ajout-poste").value.trim();
  var entreprise = document.getElementById("ajout-entreprise").value.trim();
  var ville      = document.getElementById("ajout-ville").value.trim();
  var domaine    = document.getElementById("ajout-domaine").value;
  var statut     = document.getElementById("ajout-statut").value;

  // Validation basique
  if (!poste || !entreprise || !ville) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Générer la date du jour au format JJ/MM/AAAA
  var today   = new Date();
  var jour    = String(today.getDate()).padStart(2, "0");
  var mois    = String(today.getMonth() + 1).padStart(2, "0");
  var annee   = today.getFullYear();
  var dateFmt = jour + "/" + mois + "/" + annee;

  // Nouvel identifiant = dernier id + 1
  var newId = candidatures.length > 0 ? candidatures[candidatures.length - 1].id + 1 : 1;

  // Créer l'objet et l'ajouter au tableau
  var nouvelle = new Candidature(newId, poste, entreprise, dateFmt, statut, ville, domaine);
  candidatures.push(nouvelle);

  // Rafraîchir l'affichage
  afficherTableau(candidatures);

  // Réinitialiser le formulaire
  document.getElementById("form-ajout-candidature").reset();

  // Confirmation visuelle
  afficherNotification("✅ Candidature ajoutée avec succès !", "success");
}

/* ============================================================
   4b. FONCTION D'AFFICHAGE DES DONNÉES
   ============================================================ */

/**
 * Affiche une notification temporaire à l'écran
 * @param {string} message - Message à afficher
 * @param {string} type    - "success" | "error" | "info"
 */
function afficherNotification(message, type) {
  var notif = document.getElementById("notif-js");
  if (!notif) return;

  // Choisir la classe selon le type
  notif.className = "alert";
  if (type === "success") notif.classList.add("alert-success");
  else if (type === "error") notif.classList.add("alert-error");
  else notif.classList.add("alert-info");

  notif.textContent = message;
  notif.style.display = "block";

  // Masquer après 3 secondes
  setTimeout(function () {
    notif.style.display = "none";
  }, 3000);
}

/* ============================================================
   5. RECHERCHE DANS LE TABLEAU
   ============================================================ */

/**
 * Recherche des candidatures selon un mot-clé et un filtre de statut
 * Met à jour l'affichage avec les résultats filtrés
 */
function rechercherCandidatures() {
  // Lire le mot-clé et le filtre statut
  var motCle = document.getElementById("recherche-keyword").value.trim().toLowerCase();
  var filtre = document.getElementById("recherche-statut").value;

  // Filtrer le tableau principal
  var resultats = candidatures.filter(function (c) {
    // Vérifier si le mot-clé correspond à poste, entreprise, ville ou domaine
    var correspondKeyword =
      c.poste.toLowerCase().includes(motCle)      ||
      c.entreprise.toLowerCase().includes(motCle) ||
      c.ville.toLowerCase().includes(motCle)      ||
      c.domaine.toLowerCase().includes(motCle);

    // Vérifier le filtre statut ("" = tous)
    var correspondStatut = filtre === "" || c.statut === filtre;

    return correspondKeyword && correspondStatut;
  });

  // Afficher les résultats
  afficherTableau(resultats);

  // Notification du résultat
  afficherNotification(
    "🔍 " + resultats.length + " résultat(s) trouvé(s) pour « " + (motCle || "tous") + " »",
    "info"
  );
}

/* ============================================================
   INITIALISATION — Lancement au chargement de la page
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  // Afficher le tableau initial
  afficherTableau(candidatures);

  // Bouton Ajouter
  var btnAjouter = document.getElementById("btn-ajouter-candidature");
  if (btnAjouter) {
    btnAjouter.addEventListener("click", function () {
      ajouterCandidature();
    });
  }

  // Bouton Rechercher
  var btnRechercher = document.getElementById("btn-rechercher");
  if (btnRechercher) {
    btnRechercher.addEventListener("click", function () {
      rechercherCandidatures();
    });
  }

  // Touche Entrée dans le champ de recherche
  var champRecherche = document.getElementById("recherche-keyword");
  if (champRecherche) {
    champRecherche.addEventListener("keyup", function (e) {
      if (e.key === "Enter") rechercherCandidatures();
    });
  }

  // Bouton Reset recherche
  var btnReset = document.getElementById("btn-reset-recherche");
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      document.getElementById("recherche-keyword").value = "";
      document.getElementById("recherche-statut").value  = "";
      afficherTableau(candidatures);
    });
  }
});
