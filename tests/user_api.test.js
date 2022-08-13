const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const bcrypt = require('bcrypt')
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User ({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with new username', async () => {
        
    })
})