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
const dayOfTravelEvents = {
  'AS100': [
    { event: 'boardStart', time: '2 hours before', status: 'pending' }
  ],
  'AS200': [
    { event: 'boardStart', time: '2 hours before', status: 'pending' }
  ],
  'AS300': [
    { event: 'boardStart', time: '2 hours before', status: 'pending' }
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
          .grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px;
          }
          .grid-item {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .flight-header {
            text-align: center;
            margin: 20px 0;
          }
          .flight-header span {
            display: block;
            font-size: 18px;
            margin: 5px 0;
          }
          table {
            width: 100%;
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
          .events-table th {
            background-color: #e8f4f8;
          }
          .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
          }
          .back-button, .create-rule-button {
            display: inline-block;
            padding: 10px 20px;
            text-align: center;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .back-button:hover, .create-rule-button:hover {
            background-color: #0056b3;
          }
          .status-icon {
            font-size: 18px;
            display: inline-block;
            text-align: center;
            width: 20px;
          }
          .status-completed {
            color: green;
          }
          .status-paused {
            color: red;
          }
          .status-pending {
            color: gray;
          }
        </style>
      </head>
      <body>
        <h1>Flight Details</h1>
        <div class="flight-header">
          <span> ${flight.flightNumber}</span>
          <span> ${flight.departure} -> ${flight.destination}</span>
        </div>
        <div class="grid-container">
          <div class="grid-item">
            <h2>Pre-Travel Events</h2>
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
                    <td>
                      <span class="status-icon ${
                        event.status === 'completed' ? 'status-completed' :
                        event.status === 'paused' ? 'status-paused' :
                        'status-pending'
                      }">
                        ${
                          event.status === 'completed' ? '✅' :
                          event.status === 'paused' ? '<span style="color: red;">⏸</span>' :
                          '<span style="color: red;">⚪</span>'
                        }
                      </span>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="3" style="text-align: center;">No pre-travel events available</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
          <div class="grid-item">
            <h2>Day of Travel Events</h2>
            <table class="events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${dayOfTravelEvents[flight.flightNumber] ? dayOfTravelEvents[flight.flightNumber].map(event => `
                  <tr>
                    <td>${event.event}</td>
                    <td>${event.time}</td>
                    <td>
                      <span class="status-icon ${
                        event.status === 'completed' ? 'status-completed' :
                        event.status === 'paused' ? 'status-paused' :
                        'status-pending'
                      }">
                        ${
                          event.status === 'completed' ? '✅' :
                          event.status === 'paused' ? '<span style="color: red;">⏸</span>' :
                          '<span style="color: red;">⚪</span>'
                        }
                      </span>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="3" style="text-align: center;">No day of travel events available</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
        <div class="button-container">
          <a href="/flights" class="back-button">Back to Flights</a>
          <a href="/createrule/${flight.flightNumber}" class="create-rule-button">Create New Rule</a>
        </div>
      </body>
    </html>
  `;

  res.send(html);
});


// POST API to create a new rule for a specific flight
router.get('/createrule/:flightNumber', function(req, res, next) {
  const flightNumber = req.params.flightNumber;

  let html = `
    <html>
      <head>
        <title>Create Rule</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
          }
          form {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
          }
          input, textarea, select {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          button {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <h1>Create Rule for Flight ${flightNumber}</h1>
        <form method="POST" action="/createrule/${flightNumber}">
          <label for="trigger">Trigger</label>
          <select id="trigger" name="trigger" required>
            <option value="preorderFood">Preorder Food</option>
            <option value="checkIn">Check-In</option>
            <option value="boardStart">Boarding Start</option>
          </select>
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="4" required></textarea>
          <label for="dateRange">Date Range</label>
          <input type="text" id="dateRange" name="dateRange" placeholder="e.g., 6 days before" required />
          <label for="type">Type</label>
          <select id="type" name="type" required>
            <option value="preTravel">Pre-Travel</option>
            <option value="dayOfTravel">Day of Travel</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `;

  res.send(html);
});