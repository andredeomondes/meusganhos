// Image Export Utility
class ImageExporter {
  static async exportToImage() {
    try {
      // Dynamically load html2canvas from CDN
      await this.loadHtml2Canvas();
      
      const preview = document.getElementById('exportPreview');
      
      // Temporarily show all elements for capture
      const originalDisplay = preview.style.display;
      preview.style.display = 'block';
      
      const canvas = await html2canvas(preview, {
        backgroundColor: '#1a1a1a',
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      });
      
      // Restore original display
      preview.style.display = originalDisplay;
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.download = `meusganhos_${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(url);
      }, 'image/png');
      
    } catch (error) {
      console.error('Erro ao exportar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente!');
    }
  }
  
  static loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
      if (typeof html2canvas !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  static updatePreviewData(data, currencySymbol) {
    const elements = {
      prevFaturamento: `${currencySymbol} ${(data.faturamento || 0).toFixed(2)}`,
      prevKm: `${data.kmRodado || 0} km`,
      prevCustos: `${currencySymbol} ${(data.custosTotais || 0).toFixed(2)}`,
      prevLucro: `${currencySymbol} ${(data.lucroTotal || 0).toFixed(2)}`
    };
    
    Object.keys(elements).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = elements[id];
      }
    });
    
    // Update date
    const dateElement = document.querySelector('.preview-date');
    if (dateElement) {
      const date = new Date();
      dateElement.textContent = date.toLocaleDateString('pt-BR');
    }
  }
}