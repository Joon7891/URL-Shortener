const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/url/:id', (req, res) => {
  // Get a short url by ID
});

app.get('/:id', (req, res) => {
  // To Do: Redirect to url
});

app.post('/url', (req, res) => {
  // To Do: Create a short url
});

const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});