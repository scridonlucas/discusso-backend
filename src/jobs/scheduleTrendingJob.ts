import cron from 'node-cron';
import { updateTrendingScores } from '../services/trendingService';

export function initializeTrendingScheduler(): void {
  cron.schedule('0 * * * *', async () => {
    console.log(
      'Trending score scheduler initialized. Scores will be updated every hour.'
    );
    try {
      await updateTrendingScores();
      console.log(
        `[${new Date().toISOString()}] Trending score update completed.`
      );
    } catch (error) {
      console.error(error);
    }
  });
}
