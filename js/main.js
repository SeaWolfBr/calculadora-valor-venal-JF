function calcularValorVenal() {
  // Terreno
  const valorM2Terreno = parseFloat(document.getElementById('valorM2TerrenoInformado').value.replace(/\./g, '').replace(',', '.'));
  const valorTerrenoInformado = parseFloat(document.getElementById('valorTerrenoInformado').value.replace(/\./g, '').replace(',', '.'));
  const areaIsotima = document.getElementById('areaIsotima').value
    .toUpperCase()
    .replace(/\s+/g, '')
    .normalize("NFD")
    .replace(/[^A-Z0-9]/g, '');

  // Edificação
  const tipo = document.getElementById('tipo').value;
  const padrao = document.getElementById('padrao').value;
  const valorM2ConstrucaoInformado = parseFloat(document.getElementById('valorM2ConstrucaoInformado').value.replace(/\./g, '').replace(',', '.'));
  const valorConstrucaoInformado = parseFloat(document.getElementById('valorConstrucaoInformado').value.replace(/\./g, '').replace(',', '.'));

  if (
    isNaN(valorM2Terreno) ||
    isNaN(valorTerrenoInformado) ||
    isNaN(valorM2ConstrucaoInformado) ||
    isNaN(valorConstrucaoInformado) ||
    !areaIsotima ||
    !tipo ||
    !padrao
  ) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  // Obter valor de referência do m² do terreno e fator de comercialização
  const dadosArea = tabelaPGVT[areaIsotima];
  if (!dadosArea) {
    alert("Área Isótima não encontrada.");
    return;
  }

  const valorM2ReferenciaTerreno = dadosArea.valorM2;
  const fatorComercializacao = dadosArea.fatores[tipo];
  if (!fatorComercializacao) {
    alert("Fator de comercialização não encontrado para o tipo informado.");
    return;
  }

  // Cálculo do valor venal do terreno
  const areaCalculadaTerreno = valorTerrenoInformado / valorM2Terreno;
  const valorVenalTerreno = areaCalculadaTerreno * valorM2ReferenciaTerreno;

  // Obter valor de referência do m² da construção
  const valorM2ReferenciaConstrucao = tabelaTPC[tipo][padrao];
  if (!valorM2ReferenciaConstrucao) {
    alert("Valor de referência da construção não encontrado.");
    return;
  }

  // Cálculo do valor venal da edificação
  const areaCalculadaConstrucao = valorConstrucaoInformado / valorM2ConstrucaoInformado;
  const valorVenalConstrucao = areaCalculadaConstrucao * valorM2ReferenciaConstrucao;

  // Soma e aplicação do fator
  const valorVenalTotal = (valorVenalTerreno + valorVenalConstrucao) * fatorComercializacao;

  // Exibição do resultado
  const resultado = `
    <h3>Resultado</h3>
    <p><strong>Valor venal do terreno:</strong> R$ ${valorVenalTerreno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
    <p><strong>Valor venal da edificação:</strong> R$ ${valorVenalConstrucao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
    <p><strong>Valor venal total:</strong> R$ ${valorVenalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
    <hr>
    <small>Área Isótima: ${areaIsotima}</small>
  `;
  document.getElementById('resultado').innerHTML = resultado;
}

// Máscara estilo calculadora para campos de valor
function aplicarMascaraMoedaCalculadora(input) {
  input.valorRaw = "0"; // Armazena o número bruto

  input.addEventListener("keydown", function (e) {
    if (["Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) return;

    e.preventDefault();

    let raw = input.valorRaw;

    if (e.key === "Backspace") {
      raw = raw.slice(0, -1);
    } else if (/\d/.test(e.key)) {
      if (raw.length < 15) {
        raw += e.key;
      }
    }

    if (raw === "") raw = "0";

    input.valorRaw = raw;

    const valorNumerico = parseInt(raw, 10) / 100;

    input.value = valorNumerico.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  input.addEventListener("paste", (e) => e.preventDefault());

  // Inicializa como 0,00
  input.valorRaw = "0";
  input.value = "0,00";
}

// Aplica a máscara em todos os campos de valor
window.addEventListener("DOMContentLoaded", () => {
  const campos = [
    "valorM2TerrenoInformado",
    "valorTerrenoInformado",
    "valorM2ConstrucaoInformado",
    "valorConstrucaoInformado"
  ];

  campos.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) aplicarMascaraMoedaCalculadora(campo);
  });
});
