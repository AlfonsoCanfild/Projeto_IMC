// Scripts para a calculadora de IMC - Versão Mobile

document.getElementById("calcularMobile").onclick = function() {

  const peso = Number(document.getElementById("pesoMobile").value);
  const altura = Number(document.getElementById("alturaMobile").value);

  if (!peso || peso <= 0) {
    alert("Informe um peso válido.");
    return;
  }
  if (!altura || altura <= 0) {
    alert("Informe uma altura válida.");
    return;
  }

  const imc = peso / (altura * altura);
  const resultado = document.getElementById("resultadoMobile");
  const descricao = document.getElementById("descricaoMobile");

  // Definição da classificação
  let texto = "";
  let cor = "";

  if (imc < 18.5) {
    texto = "Abaixo do Peso";
    cor = "#f4c542";   // amarelo
  } else if (imc < 25) {
    texto = "Peso Normal";
    cor = "#2ecc71";   // verde
  } else if (imc < 30) {
    texto = "Sobrepeso";
    cor = "#f4c542";   // amarelo
  } else if (imc < 40) {
    texto = "Obesidade";
    cor = "#e67e22";   // laranja
  } else {
    texto = "Obesidade Grave";
    cor = "#e74c3c";   // vermelho
  }

  // Exibir resultado
  resultado.style.display = "block";
  resultado.style.background = cor;
  resultado.textContent = imc.toFixed(2) + " kg/m²";

  descricao.style.display = "block";
  descricao.textContent = texto;
};
