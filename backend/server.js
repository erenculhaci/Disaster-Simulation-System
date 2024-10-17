const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const nodeRoutes = require('./routes/nodeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

db.sync()
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => console.log(error));

app.use('/api/nodes', nodeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
