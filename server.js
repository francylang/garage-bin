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

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('garage_items').where('id', id).select()
    .then(item => {
      if(item) {
        return response.status(200).json(item);
      }
      return response.status(404).json({ error: `Could not locate item with id: ${id}` })
    })
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/items', (request, response) => {
  let item = request.body;
  const { id } = request.params;

  for(let requiredParameter of ['item', 'reason', 'cleanliness']) {
    if(!item[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }
  database('garage_items').insert(item, '*')
    .then(item => response.status(201).json(item))
    .catch(error => response.status(500).json({ error }));
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { item, reason, cleanliness } = request.body;
  const { id } = request.params;

  database('garage_items').where({ id }).update({ item, reason, cleanliness })
    .then(item => {
      if (item) {
        response.sendStatus(204).json(item);
      }
      response.status(422).json(`No resource with a id of ${id}`);
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
