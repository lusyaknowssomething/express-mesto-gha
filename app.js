const express = require('express');
const mongoose = require('mongoose');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { Auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB has started ...'))
  .catch((error) => console.log(error));

app.use(Auth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
