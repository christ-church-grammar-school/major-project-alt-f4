var net = require('net');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');
var HOST = '';
var PORT = 4000;
var deck1 =["ghost print","pot of gold print", "piggy power print","pig man print","more I want more print","happy bunny print","2012 print","spareChange print","reg neanderthal from the future print",'reg cat got the yarn print','rebel print','potato of fun print','pluto print','nessie print',"its christmas print",'emoji print','derpasaurus rex print','cookie print','chezburger print','Discard pele'];
var discardPile = [];
var fillDeck = [];
var cards = [];
var playerCounter = 0;
var spectatorCounter = 0;
const users = {};
const spectators = {};
var gameRun = "Not";
var gameFinnished = "No";
var Turn = 1;

function spectator(name, ip, sock){
    this.name = name;
    this.ip = ip;
    this.sock = sock;
    this.job = null;
}

function Player(name, ip, sock) {
    this.name = name;
    this.prefixes = [];
    this.ip = ip;
    this.sock = sock;
    this.order = name.replace("Player","");
    this.job = "Player";
    this.score = 0;
    this.cards = [];
    this.field = [];
    this.TurnRun = "No";
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
    this.incrementPoints = function(amount) {//sc [your score] [their score]
        //increases the person's score by amount while adding any additional things to take into acount
        this.score += (amount * this.incrementMultiplier * this.scoreMultiplier * 
        this.scoreMultiplier * this.incrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
    }

    this.decrementPoints = function(amount) {
        //decreases the person's score by amount while adding any additional things to take into acount
        this.score -= (amount * this.decrementMultiplier * this.scoreMultiplier * 
        this.scoreMultiplier * this.decrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
    }
    this.findCard = function(findCrd){
        for (handCards in this.cards){
            if (this.cards[handCards] == findCrd){
                return handCards;
            }
        }
        console.error("no card found");
    }
    this.playCard = function(name, use) {
        if (this.actionsInTurn>0){
            cards[name].ability(use);
            discardPile.push(name);
            this.cards.splice((this.findCard(name)),1);
            this.actionsInTurn--;
            updateCards(this.cards);
            updateScore();
        }
        if(this.actionsInTurn<=0){
            this.endTurn();
        }
    }
    this.endTurn = function(){
        if(gameRun=="ending"){
            gameEnded();
        } 
        else{
            if (this.TurnRun == "Yes"){
                //ends turn
                this.TurnRun = "No";
                this.actionsInTurn = 0;
                if (Turn == playerCounter){Turn = 1;}
                else{Turn ++;} 
                if (gameRun == "running"){
                    users[`Player${Turn}`].startTurn();
                }
            }
        }
    }
    this.removeCards = function(amount,special = null){ 
        if (amount == "hand"){
            for (handCards in this.cards){
                discardPile.push(handCards);
            }
            this.cards = [];
        }
        else if (special == null){
            if (this.cards.length<amount){
                console.error("amount of cards to remove to many");
            }
            else{
                for (var cardsToRemove = 0 ; cardsToRemove < amount;cardsToRemove++ ){
                    var ranNum = Math.floor(Math.random() * this.cards.length);
                    discardPile.push(this.cards.splice(ranNum,1));
                    this.cards.splice(ranNum,1);
                }
            }
        }
        else{
            //add extra else if's to only remove must plays,neggs,which cards
        }
    }
    this.getCrd = function(amount){
        if(deck1.length < amount){
            refillDeck();
        }
        for (numCardsGet = 0;numCardsGet<amount;numCardsGet++)
        {
            //draws the first card from the draw pile
            cards[deck1[0]].parent = this.name;
            this.cards.push(deck1[0]);
            deck1.splice(0, 1);
            // updateCards(this.name,this.cards);//uc cards 
        }
    //add things for stuff when you get cards------||  e.g get points
    }
    this.startTurn = function(playingPLayer){
        if (this.TurnRun == "No"){
            //add things that activate at the start of a turn
            this.getCrd(1);
            this.actionsInTurn = this.cardsToPlay;
            this.TurnRun = "Yes";
            updateCards(this.cards);
        }
    }
}
/*targets other player*/
function findOpponent(parentName){
    if (users[parentName].order == "1"){
        return "Player2";
    }
    else if (users[parentName].order == "2"){
        return "Player1";
    }
    else{
        console.error("no opponent found");
    }
}

//does everything to end game
function gameEnded(){
    gameRun = "Not";
    if (users["Player1"].score == users["Player2"].score){
        sendText("all", "The game was a Tie");
        //update score and print
    }
    else if(users["Player1"].score > users["Player2"].score){
        sendText("all", "Player 1 wins!");
    }
    else if(users["Player1"].score < users["Player2"].score){
        sendText("all", "Player 2 wins!");
    }
    else{
        console.error("No one won???");
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
//discards shuffle
function refillDeck() {
    while (0<discardPile.length)
    {
        var ranNum = Math.floor(Math.random() * discardPile.length);
        fillDeck.push(discardPile[ranNum]);
        discardPile.splice(ranNum, 1);
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
}

function findTypePlayer(IP){
    for (People in users){
        if (users[People].ip[0] == IP[0] && users[People].ip[1] == IP[1]){
            return "Player";
        }
    }
    for (people in spectator){
        if (spectator[people].ip[0] == IP[0] && spectator[people].ip[1] == IP[1]){
            return "Spectator";
        }
    }
}

function updateScore(){
    sendText("all",`sc ${users["Player1"].score} ${users["Player2"].score}`);
}

function updateCards(){
    sendText(users["Player1"],`uc [${users["Player1"].cards.join()}] [${users["Player1"].field.join()}] [${users["Player2"].field.join()}] ${users["Player2"].cards.length}`);
    sendText(users["Player2"],`uc [${users["Player2"].cards.join()}] [${users["Player2"].field.join()}] [${users["Player1"].field.join()}] ${users["Player1"].cards.length}`);
}

function sendText(player, msg){
    if (player == "all"){
        for (people in users){
            users[people].sock.write(msg+"\n");
        }
    }
    else{
        player.sock.write(msg+"\n");
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
    'ghost print': new Card('Deck',[], [], function(functionality) {
        sendText(users[this.parent], "Spooky");
    }),
    'pot of gold print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);   
                users[this.parent].getCrd(1);
        }
    }),
    'piggy power print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30);   
                users[this.parent].getCrd(1);
        }
    }),
    'pig man print': new Card('Deck',[],['action'],function(functionality){// dfkdjfklsdjfldskjflmvg jmoerkiujcgxhiec fix later if don't have 3 cards can't play
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30);   
                users[this.parent].removeCards(3);
        }
    }),
    'more I want more print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(20);   
                users[this.parent].getCrd(4);
        }
    }),
    'happy bunny print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    '2012 print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'spareChange print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(1); 
        }
    }),
    'reg neanderthal from the future print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(100); 
        }
    }),
    'reg cat got the yarn print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    'rebel print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(51); 
        }
    }),
    'potato of fun print': new Card('Deck',[],['action'],function(functionality){console.log("Look how much fun it is.")}),
    'pluto print': new Card('Deck',[],['action'],function(functionality){
        sendText(users[this.parent],"Not a planet anymore.")
        sendText(users[this.parent],"No effect.")
        sendText(users[this.parent],"Because life is tough.\n")
    }),
    'nessie print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    "its christmas print": new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'emoji print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'derpasaurus rex print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30); 
        }
    }),
    'cookie print': new Card('Deck',[],['action'],function(functionality){
        sendText(users[this.parent],"a cookie\n")
    }),
    'chezburger print': new Card('Deck',[],['action'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'Discard pele': new Card('???',[],['Play'],function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
                users[this.parent].removeCards("hand","none");
        }
    })
}



// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`);
    if (playerCounter > 1){
        //adds them as spectators
        spectatorCounter++;
        spectators[`Player${spectatorCounter}`] = new spectator(`Spectator${spectatorCounter}`, [sock.remoteAddress,sock.remotePort],sock);
    }
    else{
        // We have a connection - a socket object is assigned to the connection automatically
        playerCounter++;
        users[`Player${playerCounter}`] = new Player(`Player${playerCounter}`, [sock.remoteAddress,sock.remotePort],sock);
        //gives rights to start
        users['Player1'].job = "host"; 
    }
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        var str = decoder.write(data);
        if (str.substr(str.length-1, str.length) == '\n') {
            str = str.substr(0,str.length-1);
        }
        if (str.substr(0,6) == "#chat "){
            console.log("[CHAT]: " + str.substr(6,str.length));
            sendText(`chat ${users["Player1"],str.substr(6,str.length)}\n`);
            sendText(`chat ${users["Player2"],str.substr(6,str.length)}\n`);
        }
        //start game
        else if (str.substr(0,5) == 'start'){
            if (gameFinnished == "No"){
                if (findTypePlayer([sock.remoteAddress,sock.remotePort])=="Player"){
                    if (gameRun != "running"){
                        if (playerCounter>=2){
                            if (users[findPlayer([sock.remoteAddress,sock.remotePort])].job == "host"){
                                //game starts
                                gameRun = "running";
                                shuffleDeck()
                                for (players in users){
                                    users[players].getCrd(5);
                                    updateCards(users[players].cards);
                                }
                                users[`Player${Turn}`].startTurn();
                            }
                            else{
                                sock.write("you don't have the power to start the game."+"\n");
                            }
                        }
                        else{
                            sock.write("You need at least 2 players to start"+"\n");
                        }
                    }
                    else{
                        sock.write("game already running."+"\n");
                    }
                }
                else{
                    sock.write("You cannot participate in game"+"\n");
                }
            }
            else{
                sock.write("Exit and start a new Game to play again"+"\n");
            }
        }
        //end game
        else if (str.substr(0,7) == 'endGame'){
            if (findTypePlayer([sock.remoteAddress,sock.remotePort])=="Player"){
                if (gameRun == "running"){
                    if (users[findPlayer([sock.remoteAddress,sock.remotePort])].job == "host"){
                        sendText("all","game will finnish in one turn");
                        gameRun = "ending";
                    }
                }
            }
            else{
                sock.write("You cannot participate in game"+"\n");
            }
        }
        //playing cards
        else if (str.substr(0,2) == 'p '){
            if (gameRun == "running"|| gameRun == "ending"){
                if (findTypePlayer([sock.remoteAddress,sock.remotePort])=="Player"){
                    if (users[findPlayer([sock.remoteAddress,sock.remotePort])].TurnRun == "Yes"){
                        if (users[findPlayer([sock.remoteAddress,sock.remotePort])].cards.includes(str.substr(2,str.length))) {
                            users[findPlayer([sock.remoteAddress,sock.remotePort])].playCard(str.substr(2,str.length),"general");
                        }
                        else {
                            console.error(`No card of name ${str.substr(2,str.length)} available!`);
                        }
                    } 
                    else{
                        sock.write("Wait for your turn"+"\n");
                    }
                }
                else{
                    sock.write("You cannot participate in game"+"\n");
                }
            }
            else{
                sock.log("Game is not running"+"\n");
            }
        }
        else if (str.substr(0,4) == 'pass'){
            if (gameRun == "running"){
                if (findTypePlayer([sock.remoteAddress,sock.remotePort])=="Player"){
                    if (users[findPlayer([sock.remoteAddress,sock.remotePort])].TurnRun == "Yes"){
                        users[findPlayer([sock.remoteAddress,sock.remotePort])].endTurn();
                    }
                }
                else{
                    sock.write("You cannot participate in game"+"\n");
                }
            }
            else{
                sock.log("Game is not running"+"\n");
            }
        }
        else {
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