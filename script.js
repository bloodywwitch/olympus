const tabelaXP = [

    { min: 1, max: 10, xp: 500 },
    { min: 11, max: 20, xp: 1000 },
    { min: 21, max: 30, xp: 1500 },
    { min: 31, max: 40, xp: 2000 },
    { min: 41, max: 50, xp: 2500 },
    { min: 51, max: 60, xp: 3000 },
    { min: 61, max: 70, xp: 3500 },
    { min: 71, max: 80, xp: 4000 },
    { min: 81, max: 90, xp: 4500 },
    { min: 91, max: 100, xp: 5000 },
    { min: 101, max: 110, xp: 1000 },
    { min: 111, max: 120, xp: 1500 },
    { min: 121, max: 130, xp: 2000 },
    { min: 131, max: 140, xp: 2500 },
    { min: 141, max: 150, xp: 3000 },
    { min: 151, max: 165, xp: 2000 },
    { min: 166, max: 180, xp: 3000 },
    { min: 181, max: 190, xp: 4000 },
    { min: 191, max: 200, xp: 5000 }

];

const deuses = {

    Afrodite: { classes: ["Arcanista"] },
    Apolo: { classes: ["Vigilante", "Suporte"] },
    Ares: { classes: ["Guerrilheiro"] },
    Ártemis: { classes: ["Velocista", "Vigilante"] },
    Atena: { classes: ["Mentalista"] },
    Deméter: { classes: ["Tanque", "Suporte"] },
    Dionísio: { classes: ["Suporte"] },
    Éris: { classes: ["Mentalista"] },
    Eros: { classes: ["Arcanista", "Suporte"] },
    Hades: { classes: ["Arcanista", "Tanque"] },
    Hefesto: { classes: ["Guerrilheiro", "Tanque"] },
    Hécate: { classes: ["Arcanista"] },
    Hera: { classes: ["Suporte"] },
    Hermes: { classes: ["Velocista", "Vigilante"] },
    Hipnos: { classes: ["Mentalista"] },
    Lissa: { classes: ["Guerrilheiro", "Mentalista"] },
    Macária: { classes: ["Suporte"] },
    Nike: { classes: ["Velocista"] },
    Nêmesis: { classes: ["Vigilante"] },
    Perséfone: { classes: ["Arcanista"] },
    Poseidon: { classes: ["Vigilante", "Tanque"] },
    Thanatos: { classes: ["Mentalista"] },
    Tique: { classes: ["Velocista"] },
    Zeus: { classes: ["Guerrilheiro", "Tanque"] }

};

document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("deus");

    Object.keys(deuses)
        .sort()
        .forEach(nome => {

            select.innerHTML += `
                <option value="${nome}">
                    ${nome}
                </option>
            `;

        });

});

function xpNecessaria(nivel) {

    const faixa = tabelaXP.find(f =>
        nivel >= f.min &&
        nivel <= f.max
    );

    return faixa.xp;

}

function calcularNivel() {

    let xp = Number(document.getElementById("xpTotal").value);

    if (isNaN(xp) || xp < 0) {
        return;
    }

    let nivel = 1;

    while (
        nivel < 200 &&
        xp >= xpNecessaria(nivel)
    ) {

        xp -= xpNecessaria(nivel);
        nivel++;

    }

    document.getElementById("resultado").innerHTML = `

        <h3>Resultado</h3>

        <p>
            <strong>Nível:</strong>
            ${nivel}
        </p>

        <p>
            <strong>XP Atual:</strong>
            ${xp} / ${xpNecessaria(nivel)}
        </p>

        <p>
            <strong>Faltam:</strong>
            ${xpNecessaria(nivel) - xp} XP
        </p>

    `;

}

function possuiClasse(classes, classe) {

    return classes.includes(classe);

}

function bonusPorFaixa(nivel, faixas) {

    let bonus = faixas[0];

    for (const faixa of faixas) {

        if (nivel >= faixa.nivel) {
            bonus = faixa.valor;
        }

    }

    return bonus;

}

function aumentoApos150(nivel, aumento) {

    if (nivel <= 150) {
        return 0;
    }

    return Math.floor((nivel - 150) / 30) * aumento;

}

function calcularPV(nivel, tanque) {

    const bonus = tanque
        ? bonusPorFaixa(nivel, [
            { nivel: 1, valor: 100 },
            { nivel: 30, valor: 300 },
            { nivel: 60, valor: 450 },
            { nivel: 90, valor: 600 },
            { nivel: 120, valor: 800 },
            { nivel: 150, valor: 1000 }
        ])
        : bonusPorFaixa(nivel, [
            { nivel: 1, valor: 50 },
            { nivel: 30, valor: 100 },
            { nivel: 60, valor: 200 },
            { nivel: 90, valor: 300 },
            { nivel: 120, valor: 400 },
            { nivel: 150, valor: 500 }
        ]);

    const extra = tanque
        ? aumentoApos150(nivel, 250)
        : aumentoApos150(nivel, 150);

    return bonus + extra + (nivel * 10);

}

function calcularPM(nivel, arcanista) {

    const bonus = arcanista
        ? bonusPorFaixa(nivel, [
            { nivel: 1, valor: 5 },
            { nivel: 30, valor: 7 },
            { nivel: 60, valor: 10 },
            { nivel: 90, valor: 12 },
            { nivel: 120, valor: 15 },
            { nivel: 150, valor: 18 }
        ])
        : bonusPorFaixa(nivel, [
            { nivel: 1, valor: 3 },
            { nivel: 30, valor: 5 },
            { nivel: 60, valor: 7 },
            { nivel: 90, valor: 10 },
            { nivel: 120, valor: 12 },
            { nivel: 150, valor: 15 }
        ]);

    const extra = aumentoApos150(nivel, 3);

    if (nivel < 10) {
        return bonus;
    }

    return bonus + Math.floor(nivel / 5) + extra;

}

function calcularPD(nivel) {

    const bonus = bonusPorFaixa(nivel, [
        { nivel: 1, valor: 10 },
        { nivel: 30, valor: 15 },
        { nivel: 60, valor: 20 },
        { nivel: 90, valor: 30 },
        { nivel: 120, valor: 40 },
        { nivel: 150, valor: 50 }
    ]);

    return Math.floor(nivel / 2)
        + bonus
        + aumentoApos150(nivel, 15);

}

function calcularPS(mentalista) {

    return mentalista ? 120 : 100;

}

function calcularForca(nivel, guerreiro, tanque) {

    const ganho = (guerreiro || tanque)
        ? 6
        : 4;

    return 100 + (nivel * ganho);

}

function calcularVelocidade(nivel, velocista) {

    return Number(
        ((velocista ? 1.1 : 1) * nivel).toFixed(1)
    );

}

function calcularAlcance(nivel, vigilante) {

    return Number(
        ((vigilante ? 0.3 : 0.2) * nivel).toFixed(1)
    );

}

function calcularResistencia(nivel) {

    if (nivel <= 20) return "Chumbo";
    if (nivel <= 40) return "Bronze";
    if (nivel <= 60) return "Ferro";
    if (nivel <= 80) return "Aço";
    if (nivel <= 100) return "Prata";
    if (nivel <= 125) return "Ouro";
    if (nivel <= 150) return "Platina";
    if (nivel <= 200) return "Titânio";
    if (nivel <= 250) return "Ametista";
    if (nivel <= 300) return "Esmeralda";
    if (nivel <= 350) return "Rubi";
    if (nivel <= 400) return "Tungstênio";
    if (nivel <= 450) return "Iridium";

    return "Diamante";

}

function danoFisico(pd, forca, guerreiro) {

    const adicional = guerreiro
        ? Math.floor(forca * 0.10)
        : Math.floor(forca * 0.05);

    return pd + adicional;

}

function danoMagico(pd, pm, arcanista) {

    const adicional = arcanista
        ? pm
        : Math.floor(pm * 0.5);

    return pd + adicional;

}

function danoMisto(pd, forca, pm, guerreiro, arcanista) {

    const bonusForca = guerreiro
        ? Math.floor(forca * 0.10)
        : Math.floor(forca * 0.05);

    const bonusMana = arcanista
        ? pm
        : Math.floor(pm * 0.5);

    return pd + bonusForca + bonusMana;

}

function calcularStatus() {

    const nivel = Number(document.getElementById("nivelStatus").value);
    const nomeDeus = document.getElementById("deus").value;

    if (!nivel || nivel < 1 || nivel > 200) {
        alert("Informe um nível entre 1 e 200.");
        return;
    }

    const deus = deuses[nomeDeus];
    const classes = deus.classes;

    const tanque = possuiClasse(classes, "Tanque");
    const arcanista = possuiClasse(classes, "Arcanista");
    const guerreiro = possuiClasse(classes, "Guerrilheiro");
    const vigilante = possuiClasse(classes, "Vigilante");
    const velocista = possuiClasse(classes, "Velocista");
    const mentalista = possuiClasse(classes, "Mentalista");
    const suporte = possuiClasse(classes, "Suporte");

    const pv = calcularPV(nivel, tanque);
    const pm = calcularPM(nivel, arcanista);
    const pd = calcularPD(nivel);
    const ps = calcularPS(mentalista);

    const forca = calcularForca(nivel, guerreiro, tanque);
    const velocidade = calcularVelocidade(nivel, velocista);
    const alcance = calcularAlcance(nivel, vigilante);
    const resistencia = calcularResistencia(nivel);

    const danoFis = danoFisico(pd, forca, guerreiro);
    const danoMag = danoMagico(pd, pm, arcanista);
    const danoMis = danoMisto(pd, forca, pm, guerreiro, arcanista);

    const ficha = `
###

${nomeDeus.toUpperCase()}
Nível: ${nivel}
Classes
${classes.map(c => "• " + c).join("\n")}

ATRIBUTOS
Pontos de Vida: ${pv}/${pv}
Pontos de Mana: ${pm}/${pm}
Pontos de Dano: ${pd}
Pontos de Sanidade: ${ps}%

VALORES
Força: ${forca} kg
Velocidade: ${velocidade.toFixed(1)} m/s
Alcance: ${alcance.toFixed(1)} m
Resistência: ${resistencia}

ATAQUES
Físico: ${danoFis}
Mágico: ${danoMag}
Misto: ${danoMis}
`;

document.getElementById("resultadoStatus").innerHTML = `
    <button onclick="copiarFicha()">
        Copiar Ficha
    </button>

    <pre id="fichaStatus">${ficha}</pre>
`;

}

function copiarFicha() {

    const texto = document.getElementById("fichaStatus").innerText;

    navigator.clipboard.writeText(texto)
        .then(() => {
            alert("Ficha copiada!");
        });

}