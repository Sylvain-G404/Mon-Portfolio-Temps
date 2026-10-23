async function generateSequence() {
    let inputVal = document.getElementById('inputNumber').value;
    let number = parseInt(inputVal, 10);
    let tbody = document.querySelector('#resultTable tbody');

    tbody.innerHTML = '';

    // --- SÉCURISATION DE L'INPUT ---
    // On vérifie si ce n'est pas un nombre, ou si c'est inférieur ou égal à 0
    if (isNaN(number) || number <= 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="color: #ff4d4d; font-weight: bold; padding: 10px;">
                    Erreur : Veuillez entrer un nombre entier positif valide (ex: 6).
                </td>
            </tr>
        `;
        return; // On arrête immédiatement la fonction
    }
    // -------------------------------

    // --- BONUS : GESTION DU NOMBRE 1 ---
    if (number === 1) {
        tbody.innerHTML = `
            <tr>
                <td>1</td>
                <td>impair</td>
                <td>Déjà atteint</td>
                <td>1</td>
            </tr>
        `;
        return; // On s'arrête là, pas besoin de lancer la boucle
    }
    // -------------------------------

    while (number !== 1) {
        await new Promise(resolve => setTimeout(resolve, 400));

        let old = number;
        let type, operation, result;

        if (number % 2 === 0) {
            type = "pair";
            operation = "n / 2";
            number = number / 2;
        } else {
            type = "impair";
            operation = "3n + 1";
            number = 3 * number + 1;
        }

        result = number;

        let row = `
            <tr>
                <td>${old}</td>
                <td>${type}</td>
                <td>${operation}</td>
                <td>${result}</td>
            </tr>
        `;

        tbody.innerHTML += row;

        // --- BONUS UX : AUTO-SCROLL ---
        // Aligne l'écran sur la toute dernière ligne ajoutée de manière fluide
        tbody.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}