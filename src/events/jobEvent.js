// src/events/jobEvents.js
const EventEmitter = require("events");

class JobEmitter extends EventEmitter {}
// Vous pouvez augmenter le nombre max d’écouteurs si nécessaire :
const jobEmitter = new JobEmitter().setMaxListeners(100);

module.exports = jobEmitter;
