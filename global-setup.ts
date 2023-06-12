import * as dotenv from 'dotenv';

module.exports = () => {
  if (!process.env.CI) {
    dotenv.config({ path: '.env.test' });
  }
};
