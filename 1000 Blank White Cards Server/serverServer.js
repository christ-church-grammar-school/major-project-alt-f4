var net = require('net');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');
var HOST = '127.0.0.1';
var PORT = 4000;

const servers = [];

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
    servers.forEach(function (item) {
        sock.write(sock.remoteAddress+item+'\n');
    });    

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        var str = decoder.write(data);
        if (str.substr(str.length-1, str.length) == '\n') {
            str = str.substr(0,str.length-1);
        }
        if (str == "creeper"){
            sock.write("Aw man/n")
        }
        else if (str.substr(0,3) == "add"){
            servers.push(sock.remoteAddress+str.substr(4,str.length));
            console.log(`[ADD ${sock.remoteAddress}:${sock.remotePort}]: ${str.substr(4,str.length)}`);
        }
        else if (str == "rmv"){
            console.log(`[REMOVE ${sock.remoteAddress}:${sock.remotePort}]`);
            var i;
            for(i=0; i < servers.length;i++){
                if(sock.remoteAddress == servers[i]){
                    servers.pop(i);
                    break;
                }
            }
        }
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`);
    });
    
}).listen(PORT, HOST);

console.log(`Server listening on ${HOST}:${PORT}`);