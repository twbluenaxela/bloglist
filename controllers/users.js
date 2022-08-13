const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const duplicateUsername = await User.findOne({ username })

  if(!(username && password)){
    return response.status(400).json({ error: 'username or password missing' })
  } else if (duplicateUsername) {
    return response.status(400).json({ error: 'username already exists' })
  } else if (username.length <= 3 || password.length <= 3) {
    return response.status(400).json({ error: 'username or password length less than four characters' })
  }



  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
