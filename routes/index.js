var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
// Define a global array of flights
const flights = [
  { id: 1, airline: 'Alaska Airlines', destination: 'Seattle', departure: 'Los Angeles' },
  { id: 2, airline: 'Alaska Airlines', destination: 'New York', departure: 'San Francisco' },
  { id: 3, airline: 'Alaska Airlines', destination: 'Chicago', departure: 'Houston' }
];

// GET API to get the list of flights
router.get('/flights', function(req, res, next) {
  let tableRows = flights.map(flight => `
    <tr>
      <td>${flight.id}</td>
      <td>${flight.airline}</td>
      <td>${flight.destination}</td>
      <td>${flight.departure}</td>
    </tr>
  `).join('');

  let html = `
    <html>
      <head>
        <title>Flights</title>
      </head>
      <body>
        <h1>List of Flights</h1>
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Airline</th>
              <th>Destination</th>
              <th>Departure</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  res.send(html);
});