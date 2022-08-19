const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');
const mongoose = require('mongoose')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path: ', request.path);
  logger.info('Body: ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.log('Error', error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const tokenExtractor = async (request, response, next) => {
  const authorization = await request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    request.token = token;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  // console.log(request)
  // logger.info(request)
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token could not be decoded' });
    }
    // console.log('Decoded token:  ', decodedToken)
    const objectifiedId = new mongoose.Types.ObjectId(decodedToken.id)
    // console.log('Object ID', objectifiedId)
    const params = {
      "_id": objectifiedId
    }
    //use findONE instead of findById. I tried using find and it gave me an array. 
    /**
     * Finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }) . If you want to query by a document’s _id , use findById() instead of findOne() .
      The id is cast based on the Schema before sending the command.
      This function triggers the following middleware.
      findOne()
      Except for how it treats undefined . If you use findOne() , 
      you’ll see that findOne(undefined) and findOne({ _id: undefined }) are equivalent to findOne({}) 
      and return arbitrary documents. However, mongoose translates findById(undefined) into findOne({ _id: null }) .**
     */
    const user = await User.findOne(params._id)
    // console.log('User extractor result: ', user)
    if (user) {
      request.user = user;
    }
  } else {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
