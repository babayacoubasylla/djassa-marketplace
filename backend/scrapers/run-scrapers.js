import IvorianMarketScraper from './market-scraper.js';
import cron from 'node-cron';

class ScrapingManager {
  constructor() {
    this.scraper = new IvorianMarketScraper();
  }

  // Lancement manuel du scraping
  async runScraping() {
    console.log('📊 Lancement manuel du scraping...');
    return await this.scraper.scrapeAll();
  }

  // Programmation automatique du scraping
  setupScheduledScraping() {
    // Scraping quotidien à 6h du matin
    cron.schedule('0 6 * * *', async () => {
      console.log('⏰ Scraping automatique programmé - 6h00');
      try {
        await this.scraper.scrapeAll();
        console.log('✅ Scraping automatique terminé avec succès');
      } catch (error) {
        console.error('❌ Erreur scraping automatique:', error);
      }
    });

    // Scraping des prix toutes les 4 heures
    cron.schedule('0 */4 * * *', async () => {
      console.log('💰 Mise à jour des prix...');
      // Ici on pourrait avoir une fonction spécifique pour les prix
    });

    console.log('⏱️ Scraping automatique programmé:');
    console.log('   - Scraping complet: 6h00 quotidien');
    console.log('   - Mise à jour prix: toutes les 4h');
  }
}

// Exécution si lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new ScrapingManager();
  
  // Lancement immédiat
  manager.runScraping()
    .then(data => {
      console.log('🎉 Scraping terminé!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export default ScrapingManager;