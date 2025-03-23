const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

app.listen(5000, () => {
  console.log('✅ Test Server running on port 5000');
});
