window.addEventListener("DOMContentLoaded", () => {
    const anneesStr = [
        "1 an", "5 ans", "10 ans",
        "15 ans", "20 ans", "25 ans"
    ];

    const anneesNum = [1, 5, 10, 15, 20, 25];

    const nbTravailleurs = 29_400_000;

    // --- BASE 1 : SCÉNARIO ACTUEL (150€) ---
    const tvaMensuelle = 150;
    const tvaUnSalarie = anneesNum.map(annee => annee * 12 * tvaMensuelle);
    const tvaGlobaleMilliards = anneesNum.map(annee => 
        Number((annee * 12 * tvaMensuelle * nbTravailleurs / 1_000_000_000).toFixed(2))
    );

    // --- BASE 2 : SCÉNARIO ÉCONOMIE (50€) ---
    const tvaMensuelleEco = 50;
    const tvaUnSalarieEco = anneesNum.map(annee => annee * 12 * tvaMensuelleEco);
    const tvaGlobaleMilliardsEco = anneesNum.map(annee => 
        Number((annee * 12 * tvaMensuelleEco * nbTravailleurs / 1_000_000_000).toFixed(2))
    );

    if (typeof Chart === "undefined") {
        console.error("Chart.js n'est pas chargé.");
        return;
    }

    // G1 : Salarié Standard (Rouge)
    Chart.register(ChartDataLabels);

    new Chart(document.getElementById("monGraphique"), {
        type: "line",
        data: {
            labels: anneesStr,
            datasets: [{
                data: tvaUnSalarie,
                borderColor: "#ff4757",
                backgroundColor: "rgba(255, 71, 87, 0.12)",
                borderWidth: 4,
                tension: 0.1,
                pointBackgroundColor: "#ffffff",
                pointRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: "#ffffff",
                    anchor: "end",
                    align: "top",
                    offset: 6,
                    clamp: true,
                    font: {
                        weight: "bold",
                        size: 11
                    },
                    formatter: value =>
                        value.toLocaleString("fr-FR") + " €"
                }
            },
            scales: {
                y: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa",
                        callback: v =>
                            v.toLocaleString("fr-FR") + " €"
                    }
                },
                x: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa"
                    },
                    offset: true
                }
            }
        }
    });

    // G2 : National Standard (Rouge)
    new Chart(document.getElementById("monGraphiqueGlobal"), {
        type: "line",
        data: {
            labels: anneesStr,
            datasets: [{
                data: tvaGlobaleMilliards,
                borderColor: "#ff4757",
                backgroundColor: "rgba(255, 71, 87, 0.12)",
                borderWidth: 4,
                tension: 0.1,
                pointBackgroundColor: "#ffffff",
                pointRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: "#ffffff",
                    anchor: "end",
                    align: "top",
                    offset: 6,
                    clamp: true,
                    font: {
                        weight: "bold",
                        size: 11
                    },
                    formatter: value =>
                        value.toLocaleString("fr-FR") + " Md€"
                }
            },
            scales: {
                y: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa",
                        callback: v =>
                            v.toLocaleString("fr-FR") + " Md€"
                    }
                },
                x: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa"
                    },
                    offset: true
                }
            }
        }
    });

    // G3 : Salarié Éco (Vert)
    new Chart(document.getElementById("monGraphiqueEco"), {
        type: "line",
        data: {
            labels: anneesStr,
            datasets: [{
                data: tvaUnSalarieEco,
                borderColor: "#3ee523",
                backgroundColor: "rgba(62, 229, 35, 0.12)",
                borderWidth: 4,
                tension: 0.1,
                pointBackgroundColor: "#ffffff",
                pointRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: "#ffffff",
                    anchor: "end",
                    align: "top",
                    offset: 6,
                    clamp: true,
                    font: {
                        weight: "bold",
                        size: 11
                    },
                    formatter: value =>
                        value.toLocaleString("fr-FR") + " €"
                }
            },
            scales: {
                y: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa",
                        callback: v =>
                            v.toLocaleString("fr-FR") + " €"
                    }
                },
                x: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa"
                    },
                    offset: true
                }
            }
        }
    });

    // G4 : National Éco (Vert)
    new Chart(document.getElementById("monGraphiqueGlobalEco"), {
        type: "line",
        data: {
            labels: anneesStr,
            datasets: [{
                data: tvaGlobaleMilliardsEco,
                borderColor: "#3ee523",
                backgroundColor: "rgba(62, 229, 35, 0.12)",
                borderWidth: 4,
                tension: 0.1,
                pointBackgroundColor: "#ffffff",
                pointRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: "#ffffff",
                    anchor: "end",
                    align: "top",
                    offset: 6,
                    clamp: true,
                    font: {
                        weight: "bold",
                        size: 11
                    },
                    formatter: value =>
                        value.toLocaleString("fr-FR") + " Md€"
                }
            },
            scales: {
                y: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa",
                        callback: v =>
                            v.toLocaleString("fr-FR") + " Md€"
                    }
                },
                x: {
                    grid: {
                        color: "#333333"
                    },
                    ticks: {
                        color: "#aaaaaa"
                    },
                    offset: true
                }
            }
        }
    });
});


// ==========================================
// --- CODE V2 : GRAPHIQUES FICHE DE PAIE ---
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
    // Années sur l'axe X : une vie entière
    const anneesStrV2 = [
        "1 an",
        "5 ans",
        "10 ans",
        "20 ans",
        "30 ans",
        "40 ans",
        "50 ans",
        "60 ans"
    ];

    const anneesNumV2 = Array.of(1, 5, 10, 20, 30, 40, 50, 60);

    // Nombre de travailleurs actifs en France
    const nbTravailleursV2 = 29400000;

    // 2. Calculs mathématiques pour 1 salarié (Base 1 500 € Net/mois)
    const netMensuel = 1500;
    const brutMensuel = 1925;
    const superBrutMensuel = 2020;

    // Génération automatique des tableaux d'accumulation
    const tvaUnSalarieNet = anneesNumV2.map(annee => annee * 12 * netMensuel);
    const tvaUnSalarieBrut = anneesNumV2.map(annee => annee * 12 * brutMensuel);
    const tvaUnSalarieSuperBrut = anneesNumV2.map(annee => annee * 12 * superBrutMensuel);

    // 3. Configuration des étiquettes de texte fixes sur les points
    const optionsLabelsPointsV2 = (isMilliards) => ({
        color: '#ffffff',
        align: 'top',
        anchor: 'end',
        offset: 6,
        font: { weight: 'bold', size: 11 },
        formatter: (value) => isMilliards ? value.toLocaleString("fr-FR") + " Md€" : value.toLocaleString("fr-FR") + " €"
    });

    // 4. INJECTION DU GRAPHIQUE 1 : L'ÉCHELLE DU SALARIÉ (3 COURBES)
    const canvasIndividuelV2 = document.getElementById("graphiqueIndividuelV2");
    
    if (canvasIndividuelV2) {
        new Chart(canvasIndividuelV2, {
            type: "line",
            data: {
                labels: anneesStrV2,
                datasets: [
                    {
                        // Courbe 1 : Le COÛT TOTAL (Rouge)
                        label: "Coût total super brut",
                        data: tvaUnSalarieSuperBrut,
                        borderColor: "#ff4757",
                        backgroundColor: "rgba(255, 71, 87, 0.05)",
                        borderWidth: 4,
                        tension: 0.1,
                        pointBackgroundColor: "#ffffff",
                        pointRadius: 6,
                        fill: true,
                        datalabels: optionsLabelsPointsV2(false)
                    },
                    {
                        // Courbe 2 : Le BRUT (Bleu)
                        label: "Salaire brut",
                        data: tvaUnSalarieBrut,
                        borderColor: "#2e86de",
                        backgroundColor: "transparent",
                        borderWidth: 3,
                        tension: 0.1,
                        pointBackgroundColor: "#ffffff",
                        pointRadius: 5,
                        fill: false,
                        datalabels: { display: false }
                    },
                    {
                        // Courbe 3 : Le NET (Vert)
                        label: "Salaire net",
                        data: tvaUnSalarieNet,
                        borderColor: "#3ee523",
                        backgroundColor: "transparent",
                        borderWidth: 4,
                        tension: 0.1,
                        pointBackgroundColor: "#ffffff",
                        pointRadius: 6,
                        fill: false,
                        datalabels: { display: false }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: optionsLabelsPointsV2(false)
                },
                layout: {
                    padding: { top: 25, right: 30, left: 10 }
                },
                scales: {
                    y: {
                        grid: { color: "#333333" },
                        ticks: { color: "#aaaaaa", callback: v => v.toLocaleString("fr-FR") + " €" }
                    },
                    x: {
                        grid: { color: "#333333" },
                        ticks: { color: "#aaaaaa" },
                        offset: true
                    }
                }
            }
        });
    } // <-- FIXÉ : L'accolade ferme proprement le bloc individuel ici !

    // ===================================================
    // 5. INJECTION DU GRAPHIQUE 2 : L'ÉCHELLE NATIONALE (DÉSIMBRIQUÉ)
    // ===================================================
    
    // Calcul de l'écart mensuel total en taxes : SuperBrut (2020€) - Net (1500€) = 520 € / mois
    const taxesMensuellesFicheDePaie = superBrutMensuel - netMensuel;
    
    // Génération du tableau d'accumulation national converti directement en Milliards d'Euros
    const tvaGlobaleMilliardsV2 = anneesNumV2.map(annee => {
        const totalEuros = annee * 12 * taxesMensuellesFicheDePaie * nbTravailleursV2;
        return Number((totalEuros / 1000000000).toFixed(2));
    });

    const canvasNationalV2 = document.getElementById("graphiqueNationalV2");
    
    if (canvasNationalV2) {
        new Chart(canvasNationalV2, {
            type: "line",
            data: {
                labels: anneesStrV2,
                datasets: [
                    {
                        label: "Masse totale prélevée (Mds €)",
                        data: tvaGlobaleMilliardsV2,
                        borderColor: "#f1c40f",
                        backgroundColor: "rgba(241, 196, 15, 0.08)",
                        borderWidth: 4,
                        tension: 0.1,
                        pointBackgroundColor: "#ffffff",
                        pointRadius: 6,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: optionsLabelsPointsV2(true)
                },
                layout: {
                    padding: { top: 25, right: 30, left: 10 }
                },
                scales: {
                    y: {
                        grid: { color: "#333333" },
                        ticks: { color: "#aaaaaa", callback: v => v.toLocaleString("fr-FR") + " Md€" }
                    },
                    x: {
                        grid: { color: "#333333" },
                        ticks: { color: "#aaaaaa" },
                        offset: true
                    }
                }
            }
        });
    }

    // ==========================================
    // 6. INJECTION DU GRAPHIQUE 3 : LE DOUGHNUT V3 (SÉCURISÉ)
    // ==========================================
    const canvasDoughnutV3 = document.getElementById("graphiqueDoughnutV3");

    if (canvasDoughnutV3) {
        const valeursDoughnut = [3556.80, 998.40, 748.80, 624.00, 312.00];

        new Chart(canvasDoughnutV3, {
            type: "doughnut",
            data: {
                labels: [
                    "Modèle Social & Santé",
                    "Services Publics de base",
                    "Machine & Privilèges",
                    "Économie & Logement",
                    "Intérêts de la Dette"
                ],
                datasets: [{
                    data: valeursDoughnut,
                    backgroundColor: [
                        "#1dd1a1", // Vert menthe
                        "#54a0ff", // Bleu ciel
                        "#ff6b6b", // Rouge corail
                        "#ff9f43", // Orange
                        "#576574"  // Gris ardoise
                    ],
                    borderWidth: 2,
                    borderColor: "#1e1e1e",
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%", 
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        color: "#ffffff",
                        font: { weight: "bold", size: 11 },
                        formatter: (value, ctx) => {
                            // FIXÉ : Ciblage rigoureux du premier jeu de données via [0]
                            let dataArr = ctx.chart.data.datasets[0].data;
                            let sum = dataArr.reduce((a, b) => a + b, 0);
                            let percentage = Math.round((value * 100) / sum) + "%";
                            return percentage;
                        }
                    }
                },
                layout: {
                    padding: 5 
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    var width = chart.width,
                        height = chart.height,
                        ctx = chart.ctx;
                    
                    ctx.restore();
                    var fontSize = (height / 220).toFixed(2);
                    ctx.font = "bold " + fontSize + "em sans-serif";
                    
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center"; 
                    ctx.fillStyle = "#ffffff";
                    
                    var text = "6 240 € / an",
                        textX = width / 2,
                        textY = height / 2;
                    
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            }]
        });
    }
});