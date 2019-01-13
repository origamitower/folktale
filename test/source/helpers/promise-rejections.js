process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
})