(async () => {})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
