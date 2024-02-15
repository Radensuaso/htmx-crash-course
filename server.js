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

//Handle POST request for contacts search
const contacts = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' },
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'Bob Williams', email: 'bob@example.com' },
  { name: 'Mary Harris', email: 'mary@example.com' },
  { name: 'David Mitchell', email: 'david@example.com' },
];

app.post('/search', (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send(html`<tr></tr>`);
  }

  const searchResults = contacts.filter((c) => {
    const name = c.name.toLowerCase();
    const email = c.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });
  setTimeout(() => {
    const searchResultHTML = searchResults
      .map(
        (contact) => html`
          <tr>
            <td>
              <div class="my-4 p-2">${contact.name}</div>
            </td>
            <td>
              <div class="my-4 p-2">${contact.email}</div>
            </td>
          </tr>
        `
      )
      .join('');

    res.send(searchResultHTML);
  }, 1000);
});

//Handle POST request for contacts search from jsonPlaceholder
app.post('/search/api', async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send(html`<tr></tr>`);
  }

  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const contacts = await response.json();

  const searchResults = contacts.filter((c) => {
    const name = c.name.toLowerCase();
    const email = c.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });
  setTimeout(() => {
    const searchResultHTML = searchResults
      .map(
        (contact) => html`
          <tr>
            <td>
              <div class="my-4 p-2">${contact.name}</div>
            </td>
            <td>
              <div class="my-4 p-2">${contact.email}</div>
            </td>
          </tr>
        `
      )
      .join('');

    res.send(searchResultHTML);
  }, 500);
});

//Handle POST request for email validation
app.post('/contact/email', async (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: 'That email is valid',
    class: 'text-green-700',
  };

  const isInvalid = {
    message: 'Please enter a valid email address',
    class: 'text-red-700',
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      html`
        <div class="mb-4" hx-target="this" hx-swap="outerHTML">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            name="email"
            hx-post="/contact/email"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            value="${submittedEmail}"
            required />
          <div class="${isInvalid.class}">${isInvalid.message}</div>
        </div>
      `
    );
  } else {
    return res.send(
      html`
        <div class="mb-4" hx-target="this" hx-swap="outerHTML">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            name="email"
            hx-post="/contact/email"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            value="${submittedEmail}"
            required />
          <div class="${isValid.class}">${isValid.message}</div>
        </div>
      `
    );
  }
});

//Start the server
app.listen(3000, () => {
  console.log('Server listening to port 3000');
});
