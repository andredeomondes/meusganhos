// History Manager Utility
class HistoryManager {
  static saveDay(data) {
    const history = this.getHistory();
    
    const dayData = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };
    
    history.unshift(dayData);
    
    // Limit to 90 days
    if (history.length > 90) {
      history.length = 90;
    }
    
    localStorage.setItem('meusganhos-history', JSON.stringify(history));
    return dayData;
  }
  
  static getHistory() {
    return JSON.parse(localStorage.getItem('meusganhos-history') || '[]');
  }
  
  static clearHistory() {
    localStorage.removeItem('meusganhos-history');
  }
  
  static getStats(currencySymbol = 'R$') {
    const history = this.getHistory();
    
    if (history.length === 0) {
      return {
        bestDay: 0,
        average: 0,
        total: 0,
        daysCount: 0
      };
    }
    
    const lucros = history.map(h => h.lucroTotal || 0);
    const bestDay = Math.max(...lucros);
    const average = lucros.reduce((a, b) => a + b, 0) / lucros.length;
    const total = lucros.reduce((a, b) => a + b, 0);
    
    return {
      bestDay,
      average,
      total,
      daysCount: history.length,
      formatted: {
        bestDay: `${currencySymbol} ${bestDay.toFixed(2)}`,
        average: `${currencySymbol} ${average.toFixed(2)}`,
        total: `${currencySymbol} ${total.toFixed(2)}`
      }
    };
  }
  
  static exportToCSV(currencySymbol = 'R$') {
    const history = this.getHistory();
    
    if (history.length === 0) {
      return null;
    }
    
    const headers = [
      'Data',
      'Faturamento Total',
      'Km Rodado',
      'Gasolina',
      'Alimentação',
      'Custos Extras',
      'Lucro Total',
      'Corridas Extras'
    ];
    
    const rows = history.map(item => [
      item.date,
      item.faturamento || 0,
      item.kmRodado || 0,
      item.gasolina || 0,
      item.alimentacao || 0,
      item.custoPersonalizado || 0,
      item.lucroTotal || 0,
      (item.faturamento - (item.faturamento || 0)) || 0 // corridas extras
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }
  
  static filterByDateRange(startDate, endDate) {
    const history = this.getHistory();
    
    return history.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }
}