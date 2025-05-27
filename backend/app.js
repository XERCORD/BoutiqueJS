const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
const productsRoutes = require('./routes/products');
app.use(express.json());
app.use('/api', productsRoutes);





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
