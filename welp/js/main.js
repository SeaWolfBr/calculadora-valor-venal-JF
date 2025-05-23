function calcularValorVenal() {
  const valorM2Terreno = parseFloat(document.getElementById('valorM2TerrenoInformado').value.replace(/\./g, '').replace(',', '.'));
  const valorTerrenoInformado = parseFloat(document.getElementById('valorTerrenoInformado').value.replace(/\./g, '').replace(',', '.'));
  const areaIsotima = document.getElementById('areaIsotima').value.toUpperCase().replace(/\s+/g, '').normalize("NFD").replace(/[^A-Z0-9]/g, '');

  const tipo = document.getElementById('tipo').value;
  const padrao = document.getElementById('padrao').value;
  const valorM2ConstrucaoInformado = parseFloat(document.getElementById('valorM2ConstrucaoInformado').value.replace(/\./g, '').replace(',', '.'));
  const valorConstrucaoInformado = parseFloat(document.getElementById('valorConstrucaoInformado').value.replace(/\./g, '').replace(',', '.'));

  if (
    isNaN(valorM2Terreno) || isNaN(valorTerrenoInformado) ||
    isNaN(valorM2ConstrucaoInformado) || isNaN(valorConstrucaoInformado) ||
    !areaIsotima || !tipo || !padrao
  ) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const dadosArea = tabelaPGVT[areaIsotima];
  if (!dadosArea) {
    alert("Área Isótima não encontrada.");
    return;
  }

  const valorM2ReferenciaTerreno = dadosArea.valorM2;
  const fatorComercializacao = dadosArea.fatores[tipo];
  if (!fatorComercializacao) {
    alert("Fator de comercialização não encontrado.");
    return;
  }

  const areaCalculadaTerreno = valorTerrenoInformado / valorM2Terreno;
  const valorVenalTerreno = areaCalculadaTerreno * valorM2ReferenciaTerreno;

  const valorM2ReferenciaConstrucao = tabelaTPC[tipo][padrao];
  if (!valorM2ReferenciaConstrucao) {
    alert("Valor de referência da construção não encontrado.");
    return;
  }

  const areaCalculadaConstrucao = valorConstrucaoInformado / valorM2ConstrucaoInformado;
  const valorVenalConstrucao = areaCalculadaConstrucao * valorM2ReferenciaConstrucao;

  const valorVenalTotal = (valorVenalTerreno + valorVenalConstrucao) * fatorComercializacao;

  document.getElementById('resultado').innerHTML = `
    <h3>Valor Venal do Imóvel para Fins de ITBI</h3>
    <p><strong>R$ ${valorVenalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
  `;
}

function aplicarMascaraMoedaCalculadora(input) {
  input.dataset.raw = "0";
  const atualizarValor = () => {
    const raw = input.dataset.raw || "0";
    const valorNumerico = parseInt(raw, 10) / 100;
    input.value = valorNumerico.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    input.addEventListener("input", () => {
      let digits = input.value.replace(/\D/g, "");
      if (digits.length > 15) digits = digits.slice(0, 15);
      input.dataset.raw = digits || "0";
      atualizarValor();
    });
  } else {
    input.addEventListener("keydown", function (e) {
      if (["Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) return;
      e.preventDefault();
      let raw = input.dataset.raw || "0";
      if (e.key === "Backspace") {
        raw = raw.slice(0, -1);
      } else if (/\d/.test(e.key)) {
        if (raw.length < 15) raw += e.key;
      }
      if (raw === "") raw = "0";
      input.dataset.raw = raw;
      atualizarValor();
    });
    input.addEventListener("paste", (e) => e.preventDefault());
  }
  atualizarValor();
}

function aplicarMascaraCadastro(input) {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, "").slice(0, 9); // apenas números
    if (valor.length >= 6) {
      input.value = valor.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2/$3");
    } else if (valor.length >= 3) {
      input.value = valor.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    } else {
      input.value = valor;
    }
  });
}

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

  const cadastroInput = document.getElementById("cadastroImobiliario");
  if (cadastroInput) aplicarMascaraCadastro(cadastroInput);
});

function limparCampos() {
  const ids = [
    "valorM2TerrenoInformado",
    "valorTerrenoInformado",
    "areaIsotima",
    "valorM2ConstrucaoInformado",
    "valorConstrucaoInformado",
    "tipo",
    "padrao",
    "cadastroImobiliario"
  ];
  ids.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) {
      if (campo.tagName === "SELECT") {
        campo.selectedIndex = 0;
      } else {
        campo.value = "";
        campo.dataset.raw = "0";
      }
    }
  });
  document.getElementById("resultado").innerHTML = "";
}
