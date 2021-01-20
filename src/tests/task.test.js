const request = require('supertest')
const app = require('../app')
const Task = require('../models/task')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should create task for user', () => {

})