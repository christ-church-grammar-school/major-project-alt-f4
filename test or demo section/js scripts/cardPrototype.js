var deck1 =["points","losePoints","ghost","potOfGold", "piggyPower","pigMan","moreIWantMore","happyBunny","2012","spareChange","neanderthalFromTheFuture","catGotTheYarn","rebel","potatoOfFun","pluto","nessie","it'sChristmas","emoji","derpasaurusRex","cookie","chezburger","cards"];
var fillDeck = [];
var discardPile = [];
var scoreMultiplier = 1;
var incrementMultiplier = 1;
var decrementMultiplier = 1;
var addtionalPoints = 0;
var TurnSCards = 0;
// add a new way for users to be added
var users = { 'bill':new Player("bill"),'ben':new Player("ben")}




function Card(author, functionality, tags, ability) {
    this.author = author;
    this.parent = 'deck';
    this.ability = ability;
    this.functionality = functionality;
    this.tags = tags;
}  

function Player(name) {
    
    this.name = name;
    this.order = 0;
    this.score = 0;
    this.cards = [];
    this.prefixes = [];
    this.scoreMultiplier = 1;
    this.incrementMultiplier = 1;
    this.decrementMultiplier = 1;
  
    this.givePrefix = function(prefix) {
        if (!this.prefixes.hasOwnProperty(prefix)) {
            this.prefixes.push(prefix);
        } else {
            console.error('User already has that prefix!');
        }
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
    }
}
  

cards = {
    'points': new Card('Deck', ['points', 'score', 'easy'], ['action'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
    }
    }),
    'cards': new Card('Deck', ['points', 'score', 'easy'], [], function(functionality) {
        users[this.parent].getCrd(1);
    }),
    'ghost': new Card('Deck', ['easy'], [], function(functionality) {
        console.log('spooky')
    }),
    'losePoints': new Card('Deck', ['points', 'score', 'easy'], ['action'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(50);    
    }
    }),
    'potOfGold': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);   
                users[this.parent].getCrd(1);
        }
    }),
    'piggyPower': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30);   
                users[this.parent].getCrd(1);
        }
    }),
    'pigMan': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(30);   
                users[this.parent].getCrd(3);
        }
    }),
    'moreIWantMore': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(20);   
                users[this.parent].getCrd(4);
        }
    }),
    'happyBunny': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    '2012': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'spareChange': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(1); 
        }
    }),
    'neanderthalFromTheFuture': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    'catGotTheYarn': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    'rebel': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(51); 
        }
    }),
    'potatoOfFun': new Card('Deck','','',function(functionality){console.log("Look how much fun it is.")}),
    'pluto': new Card('Deck','','',function(functionality){
        console.log("Not a planet anymore.")
        console.log("No effect.")
        console.log("Because life is tough.")
    }),
    'nessie': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(25); 
        }
    }),
    "it'sChristmas": new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'emoji': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
    'derpasaurusRex': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30); 
        }
    }),
    'cookie': new Card('Deck','','',function(functionality){
        console.log("a cookie")
    }),
    'chezburger': new Card('Deck','','',function(functionality){
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50); 
        }
    }),
}

function startTurn(playingPLayer){
    //add things that activate at the start of a turn
    users[playingPLayer].getCrd(1)
    
    if (TurnSCards=1){
        //check for all cards that can add cards at start of turn
    }
}

function shuffleDeck() {
    console.log("deck before shuffle: "+ deck1)
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
    console.log("deck after shuffle: "+ deck1)
}
function initialiseGame() {
        shuffleDeck();
        var personJoin = 'Dan';
        //users.push(personJoin,new Player(personJoin));
        for (Players in users)
        {
            users[Players].getCrd(5);
            console.log(users[Players].name+"'s cards: ["+users[Players].cards +"]")
        }
}

initialiseGame()
//basic turn
var playerPlay = 'bill';
        startTurn(playerPlay);
        console.log(playerPlay+ " picked up card, all cards:  " + users[playerPlay].cards )
        console.log(playerPlay+"'s score "+ users['bill'].score);
        console.log("Card play: "+users[playerPlay].cards[0]);
        users[playerPlay].playCard(users[playerPlay].cards[0],"general");
        
