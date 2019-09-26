const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const classesRouter = require('./classesRouter');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);
server.use('/api/classes', classesRouter);


module.exports = server;