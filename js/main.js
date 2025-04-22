function calcularValorVenal() {
    // Terreno
    const valorM2Terreno = parseFloat(document.getElementById('valorM2TerrenoInformado').value);
    const valorTerrenoInformado = parseFloat(document.getElementById('valorTerrenoInformado').value);
    const areaIsotima = document.getElementById('areaIsotima').value.trim().toUpperCase();
  
    // Edificação
    const tipo = document.getElementById('tipo').value;
    const padrao = document.getElementById('padrao').value;
    const valorM2ConstrucaoInformado = parseFloat(document.getElementById('valorM2ConstrucaoInformado').value);
    const valorConstrucaoInformado = parseFloat(document.getElementById('valorConstrucaoInformado').value);
  
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
  
    // Obter valor de referência do m2 do terreno e fator de comercialização
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
  
    // Obter valor de referência do m2 da construção
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
  <p><strong>Valor venal do terreno:</strong> R$ ${valorVenalTerreno.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  <p><strong>Valor venal da edificação:</strong> R$ ${valorVenalConstrucao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  <p><strong>Valor venal total:</strong> R$ ${valorVenalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  <hr>
  <small>Área Isótima: ${areaIsotima}</small>
`;
document.getElementById('resultado').innerHTML = resultado;
  }
  