// Main Application Logic
class MeusGanhosApp {
  constructor() {
    this.initialize();
  }

  initialize() {
    // DOM Elements
    this.themeToggle = document.getElementById('themeToggle');
    this.currencySelect = document.getElementById('currencySelect');
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.inputs = document.querySelectorAll('input[type="number"]');
    
    // State
    this.currentTheme = 'light';
    this.currentCurrency = 'BRL';
    this.currencySymbol = 'R$';
    this.currentData = null;
    
    // Initialize
    this.initTheme();
    this.initCurrency();
    this.initTabs();
    this.initEventListeners();
    this.initChart();
    this.loadFromLocalStorage();
    this.calculate();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('meusganhos-theme') || 'light';
    this.setTheme(savedTheme);
    
    this.themeToggle.addEventListener('click', () => {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('meusganhos-theme', theme);
    
    // Update toggle icon
    if (theme === 'dark') {
      this.themeToggle.classList.add('dark');
    } else {
      this.themeToggle.classList.remove('dark');
    }
  }

  initCurrency() {
    const savedCurrency = localStorage.getItem('meusganhos-currency') || 'BRL';
    this.setCurrency(savedCurrency);
    
    this.currencySelect.addEventListener('change', (e) => {
      this.setCurrency(e.target.value);
    });
  }

  setCurrency(currency) {
    this.currentCurrency = currency;
    localStorage.setItem('meusganhos-currency', currency);
    
    // Update symbol
    const symbols = {
      'BRL': 'R$',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    
    this.currencySymbol = symbols[currency] || 'R$';
    document.querySelectorAll('.currency-symbol').forEach(el => {
      el.textContent = this.currencySymbol;
    });
    
    // Update select
    this.currencySelect.value = currency;
    
    // Recalculate
    this.calculate();
  }

  initTabs() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId) {
    // Update buttons
    this.tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      }
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    
    // Special tab actions
    if (tabId === 'distribuicao') {
      this.updateDistribution();
    } else if (tabId === 'exportar') {
      this.updateExportPreview();
    }
  }

  initEventListeners() {
    // Input changes
    this.inputs.forEach(input => {
      input.addEventListener('input', () => this.calculate());
    });
    
    // Save button
    document.getElementById('btnSalvarDia').addEventListener('click', () => this.saveDay());
    
    // Clear button
    document.getElementById('btnLimpar').addEventListener('click', () => this.clearInputs());
     // PIX support
  this.initPixSupport();
    // Export buttons
    document.getElementById('btnExportCSV').addEventListener('click', () => this.exportCSV());
    document.getElementById('btnExportImage').addEventListener('click', () => this.exportImage());
    document.getElementById('btnCopyLink').addEventListener('click', () => this.copyResultsLink());
  }

initPixSupport() {
  // Copy PIX button
  document.getElementById('btnCopyPix').addEventListener('click', () => {
    const pixKey = '71988384932';
    navigator.clipboard.writeText(pixKey)
      .then(() => {
        const btn = document.getElementById('btnCopyPix');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-check"></i> Chave Copiada!';
        btn.classList.add('success');
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('success');
        }, 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar chave PIX. Tente selecionar e copiar manualmente.');
      });
  });
  
  // Generate QR Code button
  document.getElementById('btnGenerateQR').addEventListener('click', () => {
    this.showQRCodeModal();
  });
  
  // Donation amount buttons
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const amount = e.target.getAttribute('data-amount');
      this.selectDonationAmount(amount);
    });
  });
  
  // PIX key click to copy
  document.getElementById('pixKey').addEventListener('click', () => {
    const pixKey = '71988384932';
    navigator.clipboard.writeText(pixKey);
    
    // Visual feedback
    const pixDisplay = document.getElementById('pixKey');
    pixDisplay.classList.add('copied');
    setTimeout(() => pixDisplay.classList.remove('copied'), 1000);
  });
}

selectDonationAmount(amount) {
  // Remove active class from all buttons
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  event.target.classList.add('active');
  
  // Show thank you message
  const message = `Obrigado! Qualquer valor ajuda, mas R$ ${amount} é incrível! 🙏`;
  this.showToast(message, 'success');
}

showQRCodeModal() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('qrModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'qrModal';
    modal.className = 'qr-modal';
    modal.innerHTML = `
      <div class="qr-content">
        <h3><i class="fas fa-qrcode"></i> QR Code PIX</h3>
        <p>Escaneie este código com seu banco</p>
        
        <div class="qr-code">
          <div class="qr-placeholder">
            <i class="fas fa-qrcode"></i>
            <p>QR Code Gerado</p>
          </div>
        </div>
        
        <div class="pix-info">
          <p><strong>Chave PIX:</strong> 71988384932</p>
          <p><strong>Tipo:</strong> CPF 079.974.645-22</p>
          <p><strong>Nome:</strong> André Júnio Deomondes Carvalhal</p>
        </div>
        
        <button class="close-modal">
          <i class="fas fa-times"></i> Fechar
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
  
  modal.classList.add('active');
}

showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

  initChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Gasolina', 'Manutenção', 'Custos Pessoais', 'Investir/Juntar'],
        datasets: [{
          data: [30, 20, 25, 25],
          backgroundColor: [
            '#8257e5',
            '#04d361',
            '#fd951f',
            '#3172b7'
          ],
          borderWidth: 2,
          borderColor: 'var(--bg-card)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'var(--text-color)',
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const label = context.label;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  calculate() {
    // Get values
    const faturamento = parseFloat(document.getElementById('faturamento').value) || 0;
    const kmRodado = parseFloat(document.getElementById('kmRodado').value) || 0;
    const precoGasolina = parseFloat(document.getElementById('precoGasolina').value) || 0;
    const consumo = parseFloat(document.getElementById('consumo').value) || 1;
    const alimentacao = parseFloat(document.getElementById('alimentacao').value) || 0;
    const corridasExtras = parseFloat(document.getElementById('corridasExtras').value) || 0;
    const custoPersonalizado = parseFloat(document.getElementById('custoPersonalizado').value) || 0;
    
    // Calculations
    const gasolina = (kmRodado / consumo) * precoGasolina;
    const faturamentoTotal = faturamento + corridasExtras;
    const custosTotais = gasolina + alimentacao + custoPersonalizado;
    const lucroTotal = faturamentoTotal - custosTotais;
    
    // Save current data
    this.currentData = {
      faturamento: faturamentoTotal,
      kmRodado,
      gasolina,
      alimentacao,
      custoPersonalizado,
      custosTotais,
      lucroTotal,
      date: new Date().toISOString()
    };
    
    // Update UI
    this.updateResults(gasolina, alimentacao, custoPersonalizado, custosTotais, lucroTotal);
    this.saveToLocalStorage();
    
    // Update other tabs if needed
    if (document.querySelector('#distribuicao').classList.contains('active')) {
      this.updateDistribution();
    }
  }

  updateResults(gasolina, alimentacao, custosExtras, custosTotais, lucroTotal) {
    const format = (value) => `${this.currencySymbol} ${value.toFixed(2)}`;
    
    document.getElementById('gasolina').textContent = format(gasolina);
    document.getElementById('alimentacaoResult').textContent = format(alimentacao);
    document.getElementById('custosExtras').textContent = format(custosExtras);
    document.getElementById('custosTotais').textContent = format(custosTotais);
    document.getElementById('lucroTotal').textContent = format(lucroTotal);
  }

  updateDistribution() {
    if (!this.currentData) return;
    
    const lucro = this.currentData.lucroTotal;
    const percentages = [30, 20, 25, 25];
    const values = percentages.map(p => (lucro * p) / 100);
    
    // Update UI
    document.getElementById('distGasolina').textContent = `${this.currencySymbol} ${values[0].toFixed(2)}`;
    document.getElementById('distManutencao').textContent = `${this.currencySymbol} ${values[1].toFixed(2)}`;
    document.getElementById('distPessoal').textContent = `${this.currencySymbol} ${values[2].toFixed(2)}`;
    document.getElementById('distInvestir').textContent = `${this.currencySymbol} ${values[3].toFixed(2)}`;
    
    // Update chart
    this.chart.data.datasets[0].data = percentages;
    this.chart.update();
  }

  updateExportPreview() {
    if (!this.currentData) return;
    
    document.getElementById('prevFaturamento').textContent = 
      `${this.currencySymbol} ${this.currentData.faturamento.toFixed(2)}`;
    document.getElementById('prevKm').textContent = 
      `${this.currentData.kmRodado} km`;
    document.getElementById('prevCustos').textContent = 
      `${this.currencySymbol} ${this.currentData.custosTotais.toFixed(2)}`;
    document.getElementById('prevLucro').textContent = 
      `${this.currencySymbol} ${this.currentData.lucroTotal.toFixed(2)}`;
    
    // Update date
    const date = new Date();
    const dateStr = date.toLocaleDateString('pt-BR');
    document.querySelector('.preview-date').textContent = dateStr;
  }

  saveDay() {
    if (!this.currentData) return;
    
    const history = JSON.parse(localStorage.getItem('meusganhos-history') || '[]');
    
    // Add current day
    history.unshift({
      ...this.currentData,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    });
    
    // Keep only last 90 days
    if (history.length > 90) {
      history.length = 90;
    }
    
    localStorage.setItem('meusganhos-history', JSON.stringify(history));
    
    // Show success feedback
    const saveBtn = document.getElementById('btnSalvarDia');
    const originalHTML = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Salvo com sucesso!';
    saveBtn.classList.add('success');
    
    setTimeout(() => {
      saveBtn.innerHTML = originalHTML;
      saveBtn.classList.remove('success');
    }, 2000);
    
    // Update history if on that tab
    this.loadHistory();
  }

  clearInputs() {
    document.getElementById('faturamento').value = '';
    document.getElementById('kmRodado').value = '';
    document.getElementById('alimentacao').value = '';
    document.getElementById('corridasExtras').value = '';
    document.getElementById('custoPersonalizado').value = '';
    
    this.calculate();
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem('meusganhos-history') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="empty-history">
          <i class="fas fa-history"></i>
          <p>Nenhum dia salvo ainda</p>
          <small>Calcule e clique em "Salvar Este Dia"</small>
        </div>
      `;
      return;
    }
    
    // Calculate stats
    const lucros = history.map(h => h.lucroTotal);
    const melhorDia = Math.max(...lucros);
    const mediaDia = lucros.reduce((a, b) => a + b, 0) / lucros.length;
    const totalSalvo = lucros.reduce((a, b) => a + b, 0);
    
    document.getElementById('melhorDia').textContent = `${this.currencySymbol} ${melhorDia.toFixed(2)}`;
    document.getElementById('mediaDia').textContent = `${this.currencySymbol} ${mediaDia.toFixed(2)}`;
    document.getElementById('totalSalvo').textContent = `${this.currencySymbol} ${totalSalvo.toFixed(2)}`;
    
    // Render history items
    let historyHTML = '';
    history.forEach(item => {
      historyHTML += `
        <div class="history-item">
          <div class="history-date">
            <div>${item.date}</div>
            <div class="history-details">${item.kmRodado} km • ${this.currencySymbol} ${item.faturamento.toFixed(2)}</div>
          </div>
          <div class="history-values">
            <div class="history-lucro">${this.currencySymbol} ${item.lucroTotal.toFixed(2)}</div>
            <div class="history-details">Lucro</div>
          </div>
        </div>
      `;
    });
    
    historyList.innerHTML = historyHTML;
  }

  exportCSV() {
    const history = JSON.parse(localStorage.getItem('meusganhos-history') || '[]');
    
    if (history.length === 0) {
      alert('Nenhum histórico para exportar!');
      return;
    }
    
    // Create CSV
    const headers = ['Data', 'Faturamento', 'Km Rodado', 'Gasolina', 'Alimentação', 'Custos Extras', 'Lucro Total'];
    const csvData = [
      headers.join(','),
      ...history.map(item => [
        item.date,
        item.faturamento,
        item.kmRodado,
        item.gasolina,
        item.alimentacao,
        item.custoPersonalizado,
        item.lucroTotal
      ].join(','))
    ].join('\n');
    
    // Create download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `meusganhos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

exportImage() {
  this.exportToImage();
}

async exportToImage() {
  const btn = document.getElementById('btnExportImage');
  const originalHTML = btn.innerHTML;
  
  try {
    // Mostra estado de carregamento
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
    btn.disabled = true;
    
    // Usa o ImageExporter atualizado
    await ImageExporter.exportToImage();
    
  } catch (error) {
    console.error('Erro ao exportar imagem:', error);
    this.showToast('Erro ao gerar imagem. Tente novamente.', 'error');
  } finally {
    // Restaura o botão
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

  copyResultsLink() {
    if (!this.currentData) return;
    
    const dataStr = btoa(JSON.stringify(this.currentData));
    const link = `${window.location.origin}?data=${dataStr}`;
    
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Link copiado! Cole para compartilhar seus resultados.');
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
      });
  }

  saveToLocalStorage() {
    const data = {
      inputs: {
        faturamento: document.getElementById('faturamento').value,
        kmRodado: document.getElementById('kmRodado').value,
        precoGasolina: document.getElementById('precoGasolina').value,
        consumo: document.getElementById('consumo').value,
        alimentacao: document.getElementById('alimentacao').value,
        corridasExtras: document.getElementById('corridasExtras').value,
        custoPersonalizado: document.getElementById('custoPersonalizado').value
      },
      lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem('meusganhos-last-calculation', JSON.stringify(data));
  }

  loadFromLocalStorage() {
    // Load last calculation
    const saved = localStorage.getItem('meusganhos-last-calculation');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data.inputs).forEach(key => {
          const input = document.getElementById(key);
          if (input) input.value = data.inputs[key];
        });
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }
    
    // Load history
    this.loadHistory();
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MeusGanhosApp();
});