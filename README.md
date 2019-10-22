# Performance Display

Welcome to the Performance Display App! The back-end of project is created with the Node.js Cluster Module, Socket.io, and Redis, while the front-end is made with React.
CPU usage, memory usage, and other info about all connected clients are collected and displayed in real time.

# Summary

Computer performance data is collected by the node client(s), and sent to the server on an interval with socket.io. The server then sends out this data to the connected clients, again with socket.io, and displays the data on the front-end with react and HTML5 canvas animations. Seems simple so far, but things get a little bit trickier...

For performance optimization, the node.js cluster module is used so that the program can run multiple times on multiple threads. This complicates things becuase if a node client get disconnected and tries to reconnect, it cannot reliably find it's way back to the same worker node it was previously utilizing. If the client reconnects to a different worker, a new socket connection will be created unnecessarily. 

This issue is solved with Redis, an in-memory database. If a client is disconnected, when it tries to reconnect, it goes through the redis server which will direct it back to the original worker that it belongs at.

Setting all of this up is very tricky. Elad Efrat's github repo: https://github.com/elad/node-cluster-socket.io, along with the socket.io multiple nodes documentation: https://socket.io/docs/using-multiple-nodes/ were paramount in getting this done correctly.

# Installation

To run this application on your local machine, you will need to have Node.js, MongoDB and Redis installed. Installing Redis on a mac is straightforward, but a little more difficult on Windows. An easy way to install Redis for Windows users can be found here: https://github.com/microsoftarchive/redis/releases.

1. Clone this repo
2. ```cd``` into each of the three main directories (nodeClient, reactclient, and server) and run the command ```npm install```.

Then, you will need to open three terminal windows.
1. In the first terminal, cd into the ```servers``` directory and run the command ```node servers.js```
2. In the second terminal, cd into the ```nodeCleint``` directory and run the command ```node index.js```
3. Finally, in the third terminal, cd into the ```reactclient``` directory and run the command ```npm start```

As long as your MongoDB and Redis servers are running, the app will open in your browser!

![online](https://res.cloudinary.com/jeffpalmeri/image/upload/v1571760185/online.png)

If you shut down the nodeClient server, you will immediatly see the offline text pop up and the canvas animations will stop.

![offline](https://res.cloudinary.com/jeffpalmeri/image/upload/v1571760197/offline.png)

Then, fire up the nodeClient server again and you will reconnect to the same worker thread!. You'll see the offline text disapear and the canvas animation will start back up, since data is being emmited from the nodeClient once again.

![backOnline!](https://res.cloudinary.com/jeffpalmeri/image/upload/v1571760185/online.png)

If Redis was not being used in this project, then reconnecting the nodeClient server would open a new socket connection unnecessarily (as mentioned above in the summary section). This would result in a new Widget component being rendered to the screen every time. The 'offline' text would never disapear, and data updates would no longer be reflected in the original Widget component's canvas animations.
