const input = document.querySelector("input");      // champ utilisateur
const btn = document.querySelector("button");       // bouton
const tbody = document.querySelector("tbody");      // tableau
const message = document.querySelector(".message"); // message

const Style_Rsultat = document.querySelectorAll("#Style_Rsultat");


const SEUIL = 6174;         // constante de Kaprekar (objectif final)
const MAX_ITER = 20;        // while sécurité

btn.addEventListener("click", () => {

    tbody.innerHTML = "";

    let compteur = 0;               // sécurité pour éviter boucle infinie
    let resultat = input.value;     // valeur entrée par l'utilisateur
    let etatFinal= "";

    //------------------------
    //1. VALIDATION
    //------------------------
    etatFinal = validateInput(resultat);

    if (etatFinal !== "") {
        render(etatFinal, resultat);
        return;
    }
    // ------------------------
    // 2. ALGO KAPREKAR
    // ------------------------
    while (compteur < MAX_ITER) {

        resultat = String(resultat).padStart(4,"0");

        const chiffres = resultat.split("").map(Number);

        const  faible = [...chiffres].sort((a, b) => a - b).join("");

        const  fort = [...chiffres].sort((a, b) => b - a).join("");

        resultat = Number(fort) - Number(faible);

        addRow(fort,faible,resultat);

        if(resultat === 0) {
            etatFinal = "identical";
            break;
        }

        if(resultat === SEUIL) {
            etatFinal = "success";
            break;
        };
    
        compteur++;
    }
    // ------------------------
    // 3. FIN DE CAS
    // ------------------------
    if (etatFinal === "" && compteur >= MAX_ITER) {
        etatFinal = "limit";
    }
    render(etatFinal,resultat);
    setResultState(etatFinal);
});


// ------------------------
// FONCTIONS
// ------------------------
function validateInput(value) {
    if(value.length !== 4 ) {
        return "error_length";
    }
    for (let char of value) {
        if(isNaN(char)){
            return "error_nan";
        }
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
        <td>${resultat}</td>
    `;
    tbody.appendChild(row);
}

function render(etat, resultat) {
    setResultState(etat);
    switch(etat) {
        case "error_length":
            message.innerHTML = "❌ Doit contenir 4 chiffres";
        break;
        case "error_nan":
            message.innerHTML = "❌ Uniquement des chiffres";
        break;
        case "identical":
            message.innerHTML = "⚠️ Chiffres identiques détectés";
        break;
        case "limit":
            message.innerHTML = "⚠️ Limite atteinte (20 itérations)";
        break;
        case "success":
            message.innerHTML = "✅ Convergence vers 6174 : " + resultat;
        break;
        default:
            message.innerHTML = "";
    }
}

//---------------------
// setResultState ?
//---------------------

function setResultState(etat) {

    const STATE_CLASSES = {
        success: "success",
        error_nan: "error",
        error_length: "error",
        identical: "warning",
        limit: "warning"
    };

    const cssClass = STATE_CLASSES[etat];

    Style_Rsultat.forEach(el => {
        el.classList.remove("success", "error", "warning");

        if (cssClass) {
            el.classList.add(cssClass);
        }
    });
}