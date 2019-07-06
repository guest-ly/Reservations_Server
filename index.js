const express = require('express');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const sequelize = require('sequelize');
const db = require('./db/index.js');

app.use(bodyParser());
app.use(express.static('/Users/katherinewang/Desktop/Reservations/public/dist'));

app.get('/listing/:listingID', (req, res) => {
  const { listingID } = req.params;

  db.Listing.findOne({
    where: {
      id: listingID,
    },
  }).then(results => res.send(results))
    .catch(error => res.send(error));
});

app.get('/reserved/month/', (req, res) => {
  const { id, month, year } = req.query;

  db.Reserved.findAll({
    attributes: ['date'],
    where: {
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
      $and: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
      listing_id: id,
    },
  })
  .then((results) => {
    const days = results.map(date => Number(date.date.slice(-2)));
    res.send(days);
  })
    .catch(error => res.send(error));
});

app.get('/custom/month/', (req, res) => {
  const { id, month, year } = req.query;

  db.CustomRates.findAll({
    attributes: ['date', 'price'],
    where: {
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
      $and: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
      listing_id: id,
    },
  })
    .then(results => res.send(results))
    .catch(error => res.send(error));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
