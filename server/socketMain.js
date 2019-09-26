const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/perfData', { useNewUrlParser: true });
const Machine = require('./models/Machine');

function socketMain(io, socket) {
  // console.log('A scoket connected!', socket.id);
  let macA;

  socket.on('clientAuth', (key) => {
    if(key === 'nodeClient') {
      // valid node client
      socket.join('clients');
    } else if(key === 'UIClient') {
      // valid ui client has joined
      socket.join('ui');
      console.log('A react client has joined');
      Machine.find({}, (err, docs) => {
        docs.forEach((aMachine) => {
          // on load, assume all machines are offline
          aMachine.isActive = false;
          io.to('ui').emit('data', aMachine);
        });
      });
    } else {
      // an invalid client has joined. Goodbye.
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    Machine.find({macA: macA}, (err, docs) => {
      if(docs.length > 0) {
        docs[0].isActive = false;
        io.to('ui').emit('data', docs[0]);
      }
    });
  });

  // a machine has connected, check to see if it's new. If it is, add it
  socket.on('initPerfData', async (data) => {
    macA = data.macA;
    const mongooseResponse = await checkAndAdd(data);
    console.log(mongooseResponse);
  });

  socket.on('perfData', (data) => {
    // console.log(data);
    console.log('tick...');
    io.to('ui').emit('data', data);
  });
}

function checkAndAdd(data) {
  // because we are doing db stuff, we need to make this a promise
  return new Promise((resolve, reject) => {
    Machine.findOne(
      {macA: data.macA},
      (err, doc) => {
        if(err) {
          throw err;
          reject(err);
        } else if(doc === null) {
          // the record is not in the db, so add it!
          let newMachine = new Machine(data);
          newMachine.save();
          resolve('added');
        } else {
          // it is in the db, just resolve
          resolve('found');
        }
      }
    )
  });
}

module.exports = socketMain;