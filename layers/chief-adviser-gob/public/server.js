const fs = require('fs');

// Catch all errors and exit gracefully to prevent a 508 crash loop
process.on('uncaughtException', (err) => {
  fs.appendFileSync(__dirname + '/stderr.log', 'Uncaught: ' + err.message + '\n' + err.stack + '\n');
  process.exit(0); // Exit gracefully so Hostinger doesn't think we are crash-looping
});
process.on('unhandledRejection', (err) => {
  fs.appendFileSync(__dirname + '/stderr.log', 'Unhandled: ' + (err ? err.message : '') + '\n' + (err ? err.stack : '') + '\n');
  process.exit(0); 
});

try {
  import('./server/index.mjs').catch(err => {
    fs.appendFileSync(__dirname + '/stderr.log', 'Import Error: ' + err.message + '\n' + err.stack + '\n');
    process.exit(0);
  });
} catch (err) {
  fs.appendFileSync(__dirname + '/stderr.log', 'Sync Error: ' + err.message + '\n' + err.stack + '\n');
  process.exit(0);
}
