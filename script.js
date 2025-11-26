// -------- UTILIDADES --------
function calcularIMC(peso, altura) {
  if (!altura || altura <= 0) return NaN;
  return peso / (altura * altura);
}

function classificaIMC(imc) {
  if (imc < 18.6) return { label: "Abaixo do ideal", nivel: "magreza" };
  if (imc < 25.0) return { label: "Peso normal", nivel: "normal" };
  if (imc < 30.0) return { label: "Sobrepeso", nivel: "sobrepeso" };
  if (imc < 40.0) return { label: "Obesidade", nivel: "obesidade" };
  return { label: "Obesidade grau 3", nivel: "obesidade3" };
}

// -------- DOM --------
const pesoInput = document.getElementById("peso");
const alturaInput = document.getElementById("altura");
const btnCalcular = document.getElementById("calcular");
const resImc = document.getElementById("resultadoImc");
const classificacaoElem = document.getElementById("classificacao");
const dicasElem = document.getElementById("dicas");

// Histórico
const pesoRegistro = document.getElementById("pesoRegistro");
const dataRegistro = document.getElementById("dataRegistro");
const btnSalvarRegistro = document.getElementById("salvarRegistro");
const tabelaBody = document.querySelector("#tabelaHistorico tbody");

// Chart.js setup
const ctx = document.getElementById("chartPeso").getContext("2d");
let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Peso (kg)",
        data: [],
        tension: 0.25,
        borderWidth: 2
      }
    ]
  },
});

// -------- LOCALSTORAGE --------
const STORAGE_KEY = "imc_hist_v1";

function carregarHistorico() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function salvarHistorico(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function atualizarTabelaEChart() {
  const hist = carregarHistorico().sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  tabelaBody.innerHTML = "";
  const labels = [];
  const data = [];

  hist.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.peso.toFixed(1)}</td>
      <td>${row.imc.toFixed(2)}</td>
      <td><button class="del" data-date="${row.date}">Remover</button></td>
    `;
    tabelaBody.appendChild(tr);

    labels.push(row.date);
    data.push(row.peso);
  });

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();

  // evento remover
  document.querySelectorAll(".del").forEach((btn) => {
    btn.onclick = () => {
      const novaLista = carregarHistorico().filter(
        (e) => e.date !== btn.dataset.date
      );
      salvarHistorico(novaLista);
      atualizarTabelaEChart();
    };
  });
}

// -------- EVENTOS --------
btnCalcular.onclick = () => {
  const peso = Number(pesoInput.value);
  const altura = Number(alturaInput.value);

  if (!peso || peso <= 0) return alert("Informe um peso válido.");
  if (!altura || altura <= 0) return alert("Informe uma altura válida.");

  const imc = calcularIMC(peso, altura);

  resImc.textContent = imc.toFixed(2) + " kg/m²";

  const cls = classificaIMC(imc);
  classificacaoElem.textContent = cls.label;

// ===== MUDAR A COR DA CAIXA DO RESULTADO =====
const box = document.querySelector(".resultado-box");

const cores = {
  magreza: "#ffe066",     // amarelo
  normal: "#51cf66",      // verde
  sobrepeso: "#ffe066",   // amarelo
  obesidade: "#ffa94d",   // laranja
  obesidade3: "#ff6b6b"   // vermelho
};

box.style.background = cores[cls.nivel];
box.style.color = "#000";
box.style.transition = "background 0.4s ease";



  const dicas = {
    normal: "Ótimo! Continue com hábitos saudáveis.",
    magreza: "Avalie sua alimentação e procure orientação profissional.",
    sobrepeso: "Atividade física e ajuste alimentar podem ajudar.",
    obesidade: "Procure avaliação profissional — risco aumentado.",
    obesidade3: "Procure orientação médica urgente."
  };

  dicasElem.textContent = dicas[cls.nivel];
};

btnSalvarRegistro.onclick = () => {
  const peso = Number(pesoRegistro.value);
  let date = dataRegistro.value;

  if (!peso || peso <= 0) return alert("Peso inválido.");

  if (!date) {
    date = new Date().toISOString().slice(0, 10);
  }

  const altura =
    Number(alturaInput.value) ||
    Number(prompt("Informe sua altura (em metros):"));

  if (!altura || altura <= 0) return alert("Altura inválida.");

  const imc = calcularIMC(peso, altura);

  let lista = carregarHistorico().filter((r) => r.date !== date);
  lista.push({ date, peso, imc });
  salvarHistorico(lista);

  pesoRegistro.value = "";
  dataRegistro.value = "";

  atualizarTabelaEChart();
};


// ===== BOTÃO HAMBURGUER PARA MOBILE =====
const btnHamburger = document.getElementById("btnHamburger");
const mobileMenu = document.getElementById("mobileMenu");

btnHamburger.onclick = () => {
    btnHamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
};
