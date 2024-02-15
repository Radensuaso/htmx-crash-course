import express from 'express';
import { html } from 'code-tag';

const app = express();

//Set static folder
app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Handle GET request to fetch users
app.get('/users', async (req, res) => {
  const limit = +req.query.limit || 10;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
  );
  const users = await response.json();
  setTimeout(() => {
    res.send(html`
      <h1 class="text-2xl font-bold my-4">Users</h1>
      <ul>
        ${users.map((user) => `<li>${user.name}</li>`).join('')}
      </ul>
    `);
  }, 1000);
});

//Handle POST request for temp conversion
app.post('/convert', (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);

    res.send(html`
      <p>
        ${fahrenheit} degrees Fahrenheit is equal to ${celsius.toFixed(2)}
        degrees Celsius
      </p>
    `);
  }, 1000);
});

//Handle GET request to fetch for polling example

let counter = 0;

app.get('/poll', async (req, res) => {
  counter++;

  const data = { value: counter };

  res.json(data);
});

//Handle GET request for weather

let currentTemperature = 20;

app.get('/get-temperature', async (req, res) => {
  currentTemperature += Math.random() * 2 - 1; //Random temp change

  res.send(currentTemperature.toFixed(1) + 'ºC');
});

//Start the server
app.listen(3000, () => {
  console.log('Server listening to port 3000');
});
