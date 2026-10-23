const input = document.querySelector("input");      
const btn = document.querySelector("button");       
const tbody = document.querySelector("tbody");      
const message = document.querySelector(".message"); 

const SEUIL = 6174;         
const MAX_ITER = 20;        

btn.addEventListener("click", () => {
    tbody.innerHTML = "";
    message.className = "message"; // Réinitialise les classes d'erreur/succès

    let compteur = 0;               
    let resultat = input.value.trim(); // Supprime les espaces superflus
    let etatFinal = "";

    // ------------------------
    // 1. VALIDATION STRICTE
    // ------------------------
    etatFinal = validateInput(resultat);

    if (etatFinal !== "") {
        render(etatFinal, resultat);
        return;
    }

    // Cas particulier : si le nombre de départ est déjà 6174
    if (Number(resultat) === SEUIL) {
        addRow(6174, "0000", 6174);
        render("success", SEUIL);
        return;
    }

    // ------------------------
    // 2. ALGO KAPREKAR
    // ------------------------
    while (compteur < MAX_ITER) {
        resultat = String(resultat).padStart(4, "0");

        const chiffres = resultat.split("").map(Number);
        const faible = [...chiffres].sort((a, b) => a - b).join("");
        const fort = [...chiffres].sort((a, b) => b - a).join("");

        resultat = Number(fort) - Number(faible);

        addRow(fort, faible, resultat);

        // Défilement automatique vers la dernière ligne insérée
        tbody.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (resultat === 0) {
            etatFinal = "identical";
            break;
        }

        if (resultat === SEUIL) {
            etatFinal = "success";
            break;
        }
    
        compteur++;
    }

    // ------------------------
    // 3. FIN DE CAS
    // ------------------------
    if (etatFinal === "" && compteur >= MAX_ITER) {
        etatFinal = "limit";
    }
    render(etatFinal, resultat);
});

// ------------------------
// FONCTIONS DE VÉRIFICATION ET D'AFFICHAGE
// ------------------------
function validateInput(value) {
    // Vérifie à l'aide d'une Regex si la chaîne contient STRICTEMENT 4 chiffres [0-9]
    if (!/^\d{4}$/.test(value)) {
        return "error_invalid";
    }
    return "";
}

function addRow(fort, faible, resultat) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${fort}</td>
        <td>-</td>
        <td>${faible}</td>
        <td>=</td>
        <td style="font-weight: bold; color: ${resultat === SEUIL ? '#10b981' : 'inherit'}">${resultat}</td>
    `;
    tbody.appendChild(row);
}

function render(etat, resultat) {
    // On nettoie les anciennes classes du message pour appliquer la bonne couleur
    message.classList.remove("error", "warning", "success");

    switch(etat) {
        case "error_invalid":
            message.innerHTML = "❌ Entrée invalide. Veuillez saisir un nombre composé exactement de 4 chiffres.";
            message.classList.add("error");
            break;
        case "identical":
            message.innerHTML = "⚠️ Chiffres identiques détectés (Soustraction = 0).";
            message.classList.add("warning");
            break;
        case "limit":
            message.innerHTML = "⚠️ Limite atteinte (20 itérations) sans converger.";
            message.classList.add("warning");
            break;
        case "success":
            message.innerHTML = "✅ Convergence réussie vers 6174 !";
            message.classList.add("success");
            break;
        default:
            message.innerHTML = "";
    }
}
