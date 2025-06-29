document.addEventListener('DOMContentLoaded', function() {
  // Elementos do tema
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeLabel = document.querySelector('.theme-label');
  
  // Verifica preferência do sistema, mas força modo claro inicialmente
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    themeToggle.checked = false; // Força modo claro inicial
    updateTheme(false);
  } else {
    themeToggle.checked = false; // Modo claro
    updateTheme(false);
  }
  
  // Alternar tema
  themeToggle.addEventListener('change', function() {
    updateTheme(this.checked);
  });
  
  function updateTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      themeLabel.textContent = 'Modo Escuro';
    } else {
      body.classList.remove('dark-mode');
      themeLabel.textContent = 'Modo Claro';
    }
  }
  
  // Abas
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Cálculos
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', calcular);
  });
  
  function calcular() {
    const faturamento = parseFloat(document.getElementById('faturamento').value) || 0;
    const kmRodado = parseFloat(document.getElementById('kmRodado').value) || 0;
    const precoGasolina = parseFloat(document.getElementById('precoGasolina').value) || 0;
    const precoTrocaOleo = parseFloat(document.getElementById('precoTrocaOleo').value) || 0;
    const consumo = parseFloat(document.getElementById('consumo').value) || 1;
    const kmTrocaOleo = parseFloat(document.getElementById('kmTrocaOleo').value) || 1;
    
    const gasolina = (kmRodado / consumo) * precoGasolina;
    const valorTroca = (kmRodado / kmTrocaOleo) * precoTrocaOleo;
    const manutencao = faturamento * 0.05;
    
    const custos = gasolina + valorTroca + manutencao;
    const lucro = faturamento - custos;
    
    document.getElementById('valorTroca').textContent = `R$${valorTroca.toFixed(2)}`;
    document.getElementById('manutencao').textContent = `R$${manutencao.toFixed(2)}`;
    document.getElementById('gasolina').textContent = `R$${gasolina.toFixed(2)}`;
    document.getElementById('custos').textContent = `R$${custos.toFixed(2)}`;
    document.getElementById('lucro').textContent = `R$${lucro.toFixed(2)}`;
  }
  
  // Copiar PIX
  const copyPix = document.getElementById('copyPix');
  copyPix.addEventListener('click', () => {
    navigator.clipboard.writeText('71988384932');
    copyPix.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    setTimeout(() => {
      copyPix.innerHTML = '<i class="fas fa-copy"></i> Copiar Chave';
    }, 2000);
  });
  
  // Executa o cálculo inicial
  calcular();
});