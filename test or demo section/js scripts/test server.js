var net = require('net');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');
var HOST = '';
var PORT = 4000;
var deck1 =["ghost print","pot of gold print", "piggy power print","pig man print","more I want more print","happy bunny print","2012 print","spareChange print","reg neanderthal from the future print",'reg cat got the yarn print','rebel print','potato of fun print','pluto print','nessie print',"its christmas print",'emoji print','derpasaurus rex print','cookie print','chezburger print'];
var discardPile = [];
var fillDeck = [];
var cards = [];
var playerCounter = 0;
const users = {};
var gameRun = "Not";
var Turn = 1;


function Player(name, ip, IDNum) {
    this.name = name;
    this.prefixes = [];
    this.ip = ip;
    this.order = name.replace("Player","");
    this.job = "Player";
    this.score = 0;
    this.cards = [];
    this.TurnRun = "no";
    this.cardsToPlay = 1;
    this.actionsInTurn = 0;
    this.scoreMultiplier = 1;
    this.incrementMultiplier = 1;
    this.decrementMultiplier = 1;
    this.addtionalPoints = 0;

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
        this.score += (amount * this.incrementMultiplier * this.scoreMultiplier * 
        this.scoreMultiplier * this.incrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
        console.log(this.name+"'s new  score: "+users[this.name].score);
    }

    this.decrementPoints = function(amount) {
        console.log(this.name+"-decrement points by "+amount)
        //decreases the person's score by amount while adding any additional things to take into acount
        this.score -= (amount * this.decrementMultiplier * this.scoreMultiplier * 
        this.scoreMultiplier * this.decrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
        console.log(this.name+"'s new  score: "+users[this.name].score);
    }
  
    this.playCard = function(name, use) {
        if (this.actionsInTurn>0){
            if (this.cards.includes(name)) {
                cards[name].ability(use);
                discardPile.push(name);
                this.cards.splice(name,1);
                this.actionsInTurn--;
            } 
            else {
                console.error(`No card of name ${name} available!`);
            }
            //add into discard
        }
        if(this.actionsInTurn<=0){
            //ends turn
            this.TurnRun = "No";
            if (Turn == playerCounter){Turn=1;}
            else{Turn++;}      
            users[`Player${Turn}`].startTurn();
        }
        
    }
    this.getCrd = function(amount){
            for (numCardsGet = 0;numCardsGet<amount;numCardsGet++)
            {
                //draws the first card from the draw pile
                cards[deck1[0]].parent = this.name;
                this.cards.push(deck1[0]);
                deck1.splice(0, 1);
            }
        //add things for stuff when you get cards------||  e.g get points
    }
    this.startTurn = function(playingPLayer){
        //add things that activate at the start of a turn
        this.getCrd(1);
        console.log(this.cards);//remove later -------------------------------------------------------------------------------------------------------------
        this.actionsInTurn = this.cardsToPlay;
        this.TurnRun = "Yes";
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
    for (p in users){
        if (users[p].ip[0] == IP[0] && users[p].ip[1] == IP[1]){
            return p;
        }
    }
    //
    for (var i=0;i<users.length;i++){
        if (users[`Player${i}`].ip[0] == IP[0] && users[`Player${i}`].ip[1] == IP[1]){
            console.log(i);
            return `Player${i}`;
        }
    }
}

function Card(author, tags, functionality, ability) {
    this.author = author;
    this.parent = 'deck';
    this.ability = ability;
    this.functionality = functionality;
    this.tags = tags;
}

cards = {
    'ghost print': new Card('Deck', ['easy'], [], function(functionality) {
        console.log('spooky')
    }),
    'pot of gold print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);   
                users[this.parent].getCrd(1);
        }
    }),
    'piggy power print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30);   
                users[this.parent].getCrd(1);
        }
    }),
    'pig man print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(30);   
                users[this.parent].getCrd(3);
        }
    }),
    'more I want more print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(20);   
                users[this.parent].getCrd(4);
        }
    }),
    'happy bunny print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    '2012 print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'spareChange print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(1); 
        }
    }),
    'reg neanderthal from the future print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    'reg cat got the yarn print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    'rebel print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(51); 
        }
    }),
    'potato of fun print': new Card('Deck','',['action'],function(functionality){console.log("Look how much fun it is.")}),
    'pluto print': new Card('Deck','',['action'],function(functionality){
        console.log("Not a planet anymore.")
        console.log("No effect.")
        console.log("Because life is tough.")
    }),
    'nessie print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    "its christmas print": new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'emoji print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'derpasaurus rex print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30); 
        }
    }),
    'cookie print': new Card('Deck','',['action'],function(functionality){
        console.log("a cookie")
    }),
    'chezburger print': new Card('Deck','',['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
}



// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    // We have a connection - a socket object is assigned to the connection automatically
    console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
    playerCounter++;
    users[`Player${playerCounter}`] = new Player(`Player${playerCounter}`, [sock.remoteAddress,sock.remotePort]);
    //gives rights to start
    users['Player1'].job = "host"; 
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
            if (gameRun != "running"){
                if (playerCounter>=2){
                    if (users[findPlayer([sock.remoteAddress,sock.remotePort])].job == "host"){
                        //game starts
                        gameRun = "running";
                        shuffleDeck()
                        for (players in users){
                            (users[players]).getCrd(5);
                        }
                        users[`Player${Turn}`].startTurn();
                    }
                    else{
                        sock.write("you don't have the power to start the game.");
                    }
                }
                else{
                    sock.write("You need at least 2 players to start");
                }
            }
            else{
                sock.write("game already running.");
            }
        }
        //playing cards
        else if (str.substr(0,2) == 'p '){
            /*
            if (cards[str.substr(2,str.length)].functionality == "play at any time"){                   add for must plays*/
            if (users[findPlayer([sock.remoteAddress,sock.remotePort])].TurnRun == "Yes"){
                users[findPlayer([sock.remoteAddress,sock.remotePort])].playCard(str.substr(2,str.length),"general");
            } 
            else{
                sock.write("Wait for your turn");
            }
        }
        //getting things funcion
        else if (str.substr(0,4) == 'get '){//get c 8
            //get cards
            if (str.substr(4,1)=='c'){
                for (numCardsGet = 0;numCardsGet<(str.substr(5,6));numCardsGet++)
                {
                    users[findPlayer([sock.remoteAddress,sock.remotePort])].getCrd();
                }
            }
            else if (str.substr(4,1) == 'p'){
                //e.g. get p - 50
                if(str.substr(6,1) == '-'){
                    //neg points for str.substr(8,9)
                    users[findPlayer([sock.remoteAddress,sock.remotePort])].decrementPoints(str.substr(8,9));
                }
                else{
                    //add get points for a user
                    users[findPlayer([sock.remoteAddress,sock.remotePort])].incrementPoints(str.substr(8,9));
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