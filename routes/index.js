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
      <td>${flight.departure}</td>
      <td>${flight.destination}</td>
    </tr>
  `).join('');

  let html = `
    <html>
      <head>
        <title>Flights</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
          }
          table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f4f4f4;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
          a {
            color: blue;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>List of Flights</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Airline</th>
              <th>Departure</th>
              <th>Destination</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${flights.map(flight => `
              <tr>
                <td>${flight.id}</td>
                <td>${flight.airline}</td>
                <td>${flight.departure}</td>
                <td>${flight.destination}</td>
                <td><a href="/flights/${flight.id}">Go to Flight</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  res.send(html);
});