// init.js - Inicialização otimizada
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando MeusGanhos v2.0...');
  
  // Pré-carrega html2canvas em segundo plano
  setTimeout(() => {
    if (typeof html2canvas === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      console.log('📦 Pré-carregando html2canvas...');
    }
  }, 1000);
  
  // Inicializa o app
  try {
    window.app = new MeusGanhosApp();
    console.log('✅ App inicializado com sucesso!');
    
    // Marca como carregado
    document.body.classList.add('loaded');
    
    // Adiciona evento ao botão de exportação
    const exportBtn = document.getElementById('btnExportImage');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        if (window.app) {
          await window.app.exportToImage();
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao inicializar app:', error);
  }
});