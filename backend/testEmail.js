require('dotenv').config({ path: __dirname + '/.env' });
const { sendOtpEmail } = require('./utils/emailService');

console.log('Testing sendOtpEmail from emailService to hritikk1432@gmail.com...');
sendOtpEmail('hritikk1432@gmail.com', '931582', 'signup')
  .then(res => {
    console.log('SUCCESS:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
