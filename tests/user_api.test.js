const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with new username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'xiaobao',
      name: 'maomao',
      password: 'yomomma',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with statuscode 400 if username too short', async () => {
    const newUser = {
      username: 'xi',
      name: 'maomao',
      password: 'yomomma',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username or password length less than four characters');
  });

  test('creation fails with statuscode 400 if password too short', async () => {
    const newUser = {
      username: 'xiaobao',
      name: 'maomao',
      password: 'yo',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username or password length less than four characters');
  });

  test('creation fails with statuscode 400 if username already exists in database', async () => {
    const duplicate = {
      username: 'root',
      name: 'British Guy',
      password: 'notyomomma',
    };

    const result = await api
      .post('/api/users')
      .send(duplicate)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username already exists');
  });

  test('creation fails with statuscode 400 if missing username', async () => {
    const missingUsername = {
        name: 'Nick',
        password: 'yomomma',
    }

    const result = await api
      .post('/api/users')
      .send(missingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username or password missing');
    
  })
});
