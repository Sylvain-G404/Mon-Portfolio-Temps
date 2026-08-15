async function generateSequence() {
    let number = parseInt(document.getElementById('inputNumber').value);
    let tbody = document.querySelector('#resultTable tbody');

    tbody.innerHTML = '';

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
    }
}