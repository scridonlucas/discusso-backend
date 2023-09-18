import app from './app';
import config from './utils/config';

const { PORT } = config;

app.listen(PORT ?? 3001, () => {
  console.log(`Server running on port ${PORT}`);
});
