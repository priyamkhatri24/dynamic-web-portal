const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/otp', express.static(path.join(__dirname, '../otp')));
app.use('/create', express.static(path.join(__dirname, '../create')));

app.post('/getNewUserDetails', (req, res) => {
  console.log(req.body);
  res.send({ success: 1 });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
