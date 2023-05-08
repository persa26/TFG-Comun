const express = require("express");
const fileUpload = require('express-fileupload');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(fileUpload({ createParentPath: true }));
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1/', routes);
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   next();
// });

const listener = app.listen(process.env.PORT || 3080, () => {
  console.log('Listening on port ' + listener.address().port)
})