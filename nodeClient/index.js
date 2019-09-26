// The node program that captures the local performance data and sends it up to the socket.io server

const os = require('os');
const io = require('socket.io-client');
const socket = io('http://127.0.0.1:8181');
socket.on('connect', () => {
  // console.log("I connected to the socket server... hooray!");
  // we need a way to identify this machine to whomever concerned
  const networkInterface = os.networkInterfaces();
  let macA;
  // loop through all the nI for thi machine and find a non-internal one
  for(let key in networkInterface) {

    // for testing purposes
    // macA = Math.floor(Math.random() * 3) + 1;
    // break;

    if(!networkInterface[key][0].internal) {
      if(networkInterface[key][0].mac === '00:00:00:00:00:00') {
        macA = Math.random().toString(36).substr(2,15);
      } else {
      macA = networkInterface[key][0].mac;
      console.log(macA);
      }
      break;
    }
  }

  //client auth with single key value
  socket.emit('clientAuth', 'nodeClient');

  performanceData().then((allPerformanceData) => {
    allPerformanceData.macA = macA;
    socket.emit('initPerfData', allPerformanceData);
  });

  // start sending over data on interval
  let perfDataInterval = setInterval(() => {
    performanceData().then((allPerformanceData) => {
      // console.log(allPerformanceData);
      allPerformanceData.macA = macA;
      socket.emit('perfData', allPerformanceData);
    });
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(perfDataInterval);
  });
});

function performanceData () {
  return new Promise(async (resolve, reject) => {
    const cpus = os.cpus();
    // console.log(cpus[0]);

    // - CPU load (current)
    // - Memory usage
    //   - free
    const freeMem = os.freemem();

    //   - total
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;

    const memUsage = Math.floor(usedMem/totalMem * 100)/100;

    // - OS type
    const osType = os.type();

    // - uptime
    const uptime = os.uptime();
    
    // - CPU info
    //   - type
    const cpuModel = cpus[0].model;
    //   - number of cores
    const numCores = cpus.length;

    //   - clock speed
    const cpuSpeed = cpus[0].speed;

    const cpuLoad = await getCpuLoad();

    const isActive = true;
    resolve({
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      osType,
      uptime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
      isActive
    });
  });
}

function cpuAverage() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  // loop through each core
  cpus.forEach((aCore) => {
    // loop through each property of the core
    for(type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs = aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  }
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      // console.log(idleDifference, totalDifference);
      // calculate the % of used cpu
      const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference);
      resolve(percentageCpu);
    }, 1000)
  });
}