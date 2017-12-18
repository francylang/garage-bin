const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


const httpsRedirect = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.get('host')}${request.url}`);
  }
  next();
};

if (process.env.NODE_ENV === 'production') { app.use(httpsRedirect); }

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Garage Bin';
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/v1/items', (request, response) => {
  database('garage_items').select()
    .then(items => {
      console.log(items);
      return response.status(200).json(items);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/items:id', (request, response) => {
  const { id } = request.params;

  database('garage_items').select()
    .then(item => {
      if(item) {
        return response.status(200).json(item);
      }
      return response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
