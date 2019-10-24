var net = require('net');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');
var HOST = '10.60.253.99';
var PORT = 4000;
var deck1 =["ghost print","pot of gold print", "piggy power print","pig man print","more I want more print","happy bunny print","2012 print","spareChange print","reg neanderthal from the future print"];
var fillDeck=[];
var cards = [];
var playerCounter = 0;
const users = [];
var turnNum = 1;

function Player(name, ip) {
    this.name = name;
    this.score = 0;
    this.cards = [];
    this.prefixes = [];
    this.scoreMultiplier = 1;
    this.incrementMultiplier = 1;
    this.decrementMultiplier = 1;
    this.ip = ip;
    this.cardsToPlay = 1;
    this.order = name.replace("Player","");
    this.job = "Player";
  
    this.givePrefix = function(prefix) {
        if (!this.prefixes.hasOwnProperty(prefix)) {
            this.prefixes.push(prefix);
        } else {
            console.error('User already has that prefix!');
        }
    }
    this.incrementPoints = function(amount) {
        console.log(this.name+"-increment points by "+amount)
        //increases the person's score by amount while adding any additional things to take into acount
        this.score += (amount * incrementMultiplier * scoreMultiplier * 
        this.scoreMultiplier * this.incrementMultiplier + addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
        console.log(this.name+"'s new  score: "+users[this.name].score);
    }
  
    this.decrementPoints = function(amount) {
        console.log(this.name+"-decrement points by "+amount)
        //decreases the person's score by amount while adding any additional things to take into acount
        this.score -= (amount * decrementMultiplier * scoreMultiplier * 
        this.scoreMultiplier * this.decrementMultiplier + addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
        console.log(this.name+"'s new  score: "+users[this.name].score);
    }
  
    this.playCard = function(name, use) {
        if (this.cards.includes(name)) {
            cards[name].ability(use);
            discardPile.push(name);
            this.cards.splice(name);
        } 
        else {
            console.error(`No card of name ${name} available!`);
        }
        //add into discard
    }
    this.getCrd = function(amount){
            for (numCardsGet=0;numCardsGet<amount;numCardsGet++)
            {
                console.log(deck1[0]);
                //draws the first card from the draw pile
                cards[deck1[0]].parent = this.name;
                this.cards.push(deck1[0]);
                deck1.splice(0, 1);
            }
        //add things for stuff when you get cards------||  e.g get points
    }
}

//deck shuffle
function shuffleDeck() {
    while (0<deck1.length)
    {
        var ranNum = Math.floor(Math.random() * deck1.length);
        fillDeck.push(deck1[ranNum]);
        deck1.splice(ranNum, 1);
    }
    while (0<fillDeck.length)
    {
        deck1.push(fillDeck[0]);
        fillDeck.splice(0, 1);
    }
}

//finds which player said something
function findPlayer(IP){
    //
    for (var i=0;i<users.length;i++){
        if (users[i].ip[0] == IP[0] && users[i].ip[1] == IP[1]){
        return i;
        }
    }
}























// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    // We have a connection - a socket object is assigned to the connection automatically
    console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
    playerCounter++;
    users.push(new Player(`Player${playerCounter}`, [sock.remoteAddress,sock.remotePort]));
    //gives rights to start
    users[0].job = "host"; 
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        var str = decoder.write(data);
        if (str.substr(str.length-1, str.length) == '\n') {
            str = str.substr(0,str.length-1);
        }
        if (str.substr(0,6) == "#chat "){
            console.log("[CHAT]: " + str.substr(6,str.length));
            for (var i = 0; i < users.length; i++) {
                sock.write("hello")
            }
        }
        //start game
        else if (str.substr(0,5) == 'start'){
            console.log([sock.remoteAddress,sock.remotePort]);
            if (users[findPlayer([sock.remoteAddress,sock.remotePort])].job == "host"){
                shuffleDeck()
                sock.write("game started");
            }
            else{
                sock.write("you don't have the power to start the game.");
            }
        }
        //playing cards
        else if (str.substr(0,2) == 'p '){
            users[`Player${turnNum}`].playCard(str.substr(2,str.length),"general");
        }
        //getting things funcion
        else if (str.substr(0,4) == 'get '){//get c 8
            //get cards
            console.log("worked")
            if (str.substr(4,1)=='c'){
                for (numCardsGet = 0;numCardsGet<(str.substr(5,6));numCardsGet++)
                {
                    users[`Players${turnNum}`].getCrd();
                }
            }
            else if (str.substr(4,1) == 'p'){
                //e.g. get p - 50
                console.log("got points");
                if(str.substr(6,1) == '-'){
                    //neg points for str.substr(8,9)
                    users[`Players${turnNum}`].decrementPoints(str.substr(8,9));
                }
                else{
                    //add get points for a user
                    users[`Players${turnNum}`].incrementPoints(str.substr(8,9));
                }
            }
            else{
                console.log("[error]: " + str.substr(4,1));
            }
        } else {
            console.log(`[DATA ${sock.remoteAddress}:${sock.remotePort}]: ${str}`);
            // Write the data back to the socket, the client will receive it as data from the server
            sock.write(`You said "${str}"\n`);
        }
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`);
    });
    
}).listen(PORT, HOST);

console.log(`Server listening on ${HOST}:${PORT}`);