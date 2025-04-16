var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
// Define a global array of flights
const flights = [
  { flightNumber: 'AS100', airline: 'Alaska Airlines', destination: 'Seattle', departure: 'Los Angeles' },
  { flightNumber: 'AS200', airline: 'Alaska Airlines', destination: 'New York', departure: 'San Francisco' },
  { flightNumber: 'AS300', airline: 'Alaska Airlines', destination: 'Chicago', departure: 'Houston' }
];
// Define a global object to store pretravel events for each flight
const preTravelEvents = {
  'AS100': [
    { event: 'preorderFood', time: '6 days before', status: 'completed' },
    { event: 'preorderFood', time: '4 days before', status: 'completed' },
    { event: 'checkIn', time: '24 hours before', status: 'completed' },
    { event: 'checkIn', time: '4 hours before', status: 'completed' }
  ],
  'AS200': [
    { event: 'preorderFood', time: '6 days before', status: 'completed' },
    { event: 'preorderFood', time: '4 days before', status: 'completed' },
    { event: 'checkIn', time: '24 hours before', status: 'paused' },
    { event: 'checkIn', time: '4 hours before', status: 'pending' }
  ],
  'AS300': [
    { event: 'preorderFood', time: '6 days before', status: 'pending' },
    { event: 'preorderFood', time: '4 days before', status: 'pending' },
    { event: 'checkIn', time: '24 hours before', status: 'pending' },
    { event: 'checkIn', time: '4 hours before', status: 'pending' }
  ]
};
// GET API to get the list of flights
router.get('/flights', function(req, res, next) {


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
              <th>Flight Number</th>
              <th>Airline</th>
              <th>Departure</th>
              <th>Destination</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${flights.map(flight => `
              <tr>
                <td>${flight.flightNumber}</td>
                <td>${flight.airline}</td>
                <td>${flight.departure}</td>
                <td>${flight.destination}</td>
                <td><a href="/flights/${flight.flightNumber}">Go to Flight</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  res.send(html);
});

// GET API to get a specific flight by flight number
router.get('/flights/:flightNumber', function(req, res, next) {
  const flightNumber = req.params.flightNumber;
  const flight = flights.find(f => f.flightNumber === flightNumber);

  if (!flight) {
    return res.status(404).send('Flight not found');
  }

  let html = `
    <html>
      <head>
        <title>Flight Details</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
          }
          table {
            width: 50%;
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
          .events-table {
            width: 80%;
            margin: 20px auto;
          }
          .events-table th {
            background-color: #e8f4f8;
          }
        </style>
      </head>
      <body>
        <h1>Flight Details</h1>
        <table>
          <tr>
            <th>Flight Number</th>
            <td>${flight.flightNumber}</td>
          </tr>
          <tr>
            <th>Airline</th>
            <td>${flight.airline}</td>
          </tr>
          <tr>
            <th>Departure</th>
            <td>${flight.departure}</td>
          </tr>
          <tr>
            <th>Destination</th>
            <td>${flight.destination}</td>
          </tr>
        </table>
        <h2 style="text-align: center;">Pre-Travel Events</h2>
        <table class="events-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${preTravelEvents[flight.flightNumber] ? preTravelEvents[flight.flightNumber].map(event => `
              <tr>
                <td>${event.event}</td>
                <td>${event.time}</td>
                <td>${event.status}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="3" style="text-align: center;">No pre-travel events available</td>
              </tr>
            `}
          </tbody>
        </table>
        <a href="/flights">Back to Flights</a>
      </body>
    </html>
  `;

  res.send(html);
});
