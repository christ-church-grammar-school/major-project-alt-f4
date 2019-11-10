var msg2 = require('./test server.js');
function Player(name, ip, sock) {
    this.name = name;
    this.prefixes = [];
    this.ip = ip;
    this.sock = sock;
    this.order = name.replace("Player", "");
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

    this.givePrefix = function (prefix) {
        if (!this.prefixes.hasOwnProperty(prefix)) {
            this.prefixes.push(prefix);
        } else {
            console.error('User already has that prefix!');
        }
    }
    this.incrementPoints = function (amount) {//sc [your score] [their score]
        //increases the person's score by amount while adding any additional things to take into acount
        this.score += (amount * this.incrementMultiplier * this.scoreMultiplier *
            this.scoreMultiplier * this.incrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
    }

    this.decrementPoints = function (amount) {
        //decreases the person's score by amount while adding any additional things to take into acount
        this.score -= (amount * this.decrementMultiplier * this.scoreMultiplier *
            this.scoreMultiplier * this.decrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
    }
    this.findCard = function (findCrd) {
        for (handCards in this.cards) {
            if (this.cards[handCards] == findCrd) {
                return handCards;
            }
        }
        console.error("no card found");
    }
    this.playCard = function (name, use) {
        if (this.actionsInTurn > 0) {
            cards[name].ability(use);
            discardPile.push(name);
            this.cards.splice((this.findCard(name)), 1);
            this.actionsInTurn--;
            updateCards(this.cards);
        }
        if (this.actionsInTurn <= 0) {
            this.endTurn();
        }
    }
    this.endTurn = function () {
        if (gameRun == "ending") {
            gameEnded();
        }
        else {
            if (this.TurnRun == "Yes") {
                //ends turn
                this.TurnRun = "No";
                this.actionsInTurn = 0;
                if (Turn == playerCounter) { Turn = 1; }
                else { Turn++; }
                if (gameRun == "running") {
                    users[`Player${Turn}`].startTurn();
                }
            }
        }
    }
    this.removeCards = function (amount, special = null) { // users[this.parent].removeCards)(1[, card]);
        if (amount == "hand") {
            for (handCards in this.cards) {
                discardPile.push(handCards);
            }
            this.cards = [];
            // updateCards(this.name,this.cards);
        }
        else if (special == null) {
            if (this.cards.length < amount) {
                console.error("amount of cards to remove to many");
            }
            else {
                for (var cardsToRemove = 0; cardsToRemove < amount; cardsToRemove++) {
                    var ranNum = Math.floor(Math.random() * this.cards.length);
                    discardPile.push(this.cards.splice(ranNum, 1));
                    this.cards.splice(ranNum, 1);
                    // updateCards(this.name,this.cards);
                }
            }
        }
        else {
            //add extra else if's to only remove must plays,neggs,which cards
        }
    }
    this.getCrd = function (amount) {
        if (deck1.length < amount) {
            refillDeck();
        }
        for (numCardsGet = 0; numCardsGet < amount; numCardsGet++) {
            //draws the first card from the draw pile
            cards[deck1[0]].parent = this.name;
            this.cards.push(deck1[0]);
            deck1.splice(0, 1);
            // updateCards(this.name,this.cards);//uc cards 
        }
        //add things for stuff when you get cards------||  e.g get points
    }
    this.startTurn = function (playingPLayer) {
        if (this.TurnRun == "No") {
            //add things that activate at the start of a turn
            this.getCrd(1);
            this.actionsInTurn = this.cardsToPlay;
            this.TurnRun = "Yes";
            updateCards(this.cards);
        }
    }

}
//does everything to end game
function gameEnded() {
    gameRun = "Not";
    if (users["Player1"].score == users["Player2"].score) {
        sendText("all", "The game was a Tie");
        //update score and print
    }
    else if (users["Player1"].score > users["Player2"].score) {
        sendText("all", "Player 1 wins!");
    }
    else if (users["Player1"].score < users["Player2"].score) {
        sendText("all", "Player 2 wins!");
    }
    else {
        console.error("No one won???");
    }
}

//deck shuffle
function shuffleDeck() {
    while (0 < deck1.length) {
        var ranNum = Math.floor(Math.random() * deck1.length);
        fillDeck.push(deck1[ranNum]);
        deck1.splice(ranNum, 1);
    }
    while (0 < fillDeck.length) {
        deck1.push(fillDeck[0]);
        fillDeck.splice(0, 1);
    }
}
//discards shuffle
function refillDeck() {
    while (0 < discardPile.length) {
        var ranNum = Math.floor(Math.random() * discardPile.length);
        fillDeck.push(discardPile[ranNum]);
        discardPile.splice(ranNum, 1);
    }
    while (0 < fillDeck.length) {
        deck1.push(fillDeck[0]);
        fillDeck.splice(0, 1);
    }
}

//finds which player said something
function findPlayer(IP) {
    for (p in users) {
        if (users[p].ip[0] == IP[0] && users[p].ip[1] == IP[1]) {
            return p;
        }
    }
}

function findTypePlayer(IP) {
    for (People in users) {
        if (users[People].ip[0] == IP[0] && users[People].ip[1] == IP[1]) {
            return "Player";
        }
    }
    for (people in spectator) {
        if (spectator[people].ip[0] == IP[0] && spectator[people].ip[1] == IP[1]) {
            return "Spectator";
        }
    }
}

function updateCards() {
    sendText(users["Player1"], `uc cards [${users["Player1"].cards.join()}] [${users["Player1"].field.join()}] [${users["Player2"].field.join()}] ${users["Player2"].cards.length}`);
    sendText(users["Player2"], `uc cards [${users["Player2"].cards.join()}] [${users["Player2"].field.join()}] [${users["Player1"].field.join()}] ${users["Player1"].cards.length}`);
}

function sendText(player, msg) {
    if (player == "all") {
        for (people in users) {
            users[people].sock.write(msg + "\n");
        }
    }
    else {
        player.sock.write(msg + "\n");
    }
}

function Card(author, tags, functionality, ability) {
    this.author = author;
    this.parent = 'deck';
    this.ability = ability;
    this.functionality = functionality;
    this.tags = tags;
}
module.exports = {

    "3 HEADED GUARD DOG!": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),

    //Gives the person who played it 50 points
    "2012": new Card("Oscar McMath", ['Water'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);
            
        }
      }),
    "A HAPPY BEAR": new Card("Harry Trumble", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),

    //Gives the person who played it and one other person 50 points (code only works for 2 players)
    "A LOT OF HELP": new Card("Michael Calarese", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);
                users[findOpponent(this.parent)].incrementPoints(50);

        }
      }),
    "ADD MONKEYS": new Card("Ms O'Neill", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ADDLEPUSS": new Card("Jamie Bougher", ['living', 'snagglepuss'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ALEXSTRAZA": new Card("Rishi Dhakshinamoorthy", ['dragon', 'living', 'dragon boarder'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ANGRY RABBIT": new Card("Lachlan Murphy", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            var rabbsOnField = 0;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("Rabbit")){
                  rabbsOnField++;
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
      }),
    "AROUND THE WORLD": new Card("Aidan Drangi", ['living', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            if(users[this.parent].field.includes("STICKMAN UPGRADED")){
              //doesn't get extra turn
            }
            else{
              Turn--;
            }
            users[this.parent].incrementPoints(25);
        }
      }),
    "ASSASSIN DUDE": new Card("Oliver Mitteregger", ['living', 'Ninja', 'headwear'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! BART": new Card("Campbell Glendinning", ['living', 'simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! BLACK WIDOW": new Card("Mr Milton", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! CAPTAIN AMERICA": new Card("Mr Milton", ['living', ' America', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! HAWKEYE": new Card("Mr Milton", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! HOMER": new Card("Campbell Glendinning", ['living', 'simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! HULK": new Card("Mr Milton", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! IRON MAN": new Card("Mr Milton", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! LISA": new Card("Campbell Glendinning", ['living', 'simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! MAGGIE": new Card("Lachie Jones", ['living', 'simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! MARGE": new Card("Campbell Glendinning", ['living', 'simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE THE SMALL CHILDREN": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSEMBLE! THOR": new Card("Mr Milton", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BACK TO THE FUTURE CARD": new Card("Lachie Jones", [], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].score += user[this.parent].score;
        }
      }),
    "BAD NIGHTMARE": new Card("Jacob Marsh", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BALLOON KNIGHT": new Card("Lachlan Henderson", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BALLOON SWORD": new Card("Lachlan Henderson", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BANANA SHIELD": new Card("Jordon Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BARBECUE SAUCE": new Card("Max Zempilas", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DO A BARREL ROLL": new Card("Cameron Hunt", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    "BB8": new Card("Mr Milton", ['star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BESTOWED POWER!": new Card("Cameron Minchin", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BILLIONAIRE": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BLOCK IT ROCKET": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BLOOD DEMON": new Card("Joshua Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BOBASAURUS REX": new Card("Michael Calarese", ['dinosaur', 'rex', 'living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BRO FIGHT": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BUNGEE!": new Card("Ms O'Neill", [], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].cards.push(discardPile.pop());
        }
      }),
    "IT'S A BUTTER FLY!": new Card("Orlando Phillips", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BUY BUY BUY": new Card("???", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CALM RABBIT": new Card("Lachlan Murphy", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            var rabbsOnField = 0;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("Rabbit")){
                  rabbsOnField++;
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
      }),
    "CARMEN SANDIEGO": new Card("Ben Richardson", ['living', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //remove opponents hand and attain 20 points
    "CARROT OF SURRENDER": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[findOpponent(this.parent)].removeCards("hand",null);
                users[this.parent].incrementPoints(20);
        }
      }),
    "CAT TRAIN": new Card("Monte McGrath", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CATS": new Card("Oscar McMath", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CCGS BOY": new Card("Luke Simmons", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[findOpponent(this.parent)].decrementPoints(50);
        }
      }),
    "CENTRELINK": new Card("Adam Di Tullio", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CHEZBURGER": new Card("Mr Milton", ['living', 'creature'], ['Play'], function(functionality) {
        switch (functionality) {
            default:
                users[this.parent].incrementPoints(50);
        }
      }),
    "CIVIL WAR": new Card("Nick Hamdorf", ['America', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COFFEE BREAK": new Card("Will Taylor", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            //On field every time you draw gain 10 points
            //Counters tea attack
        }
      }),
    "COLOURFUL CARD": new Card("Jordan Davies", ['Rainbow'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COMPENSATION": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COOKIE MONSTER": new Card("Adam Di Tullio", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COOKIE": new Card("Adam Di Tullio", ['Useless'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COOL DOWN": new Card("???", ['Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //Does nothing
    "COOLEST CARD EVER": new Card("Jordan Davies", ['living', 'Cool', ' Useless'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].cool +=50;
        }
      }),
    "COPY THE COPY CAT": new Card("Lachie Jones", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COPY CAT": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "COUCH GAG": new Card("Lachie Jones", ['simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CRAZY RABBIT": new Card("Lachlan Murphy", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            var rabbsOnField = 0;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("Rabbit")){
                  rabbsOnField++;
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
    }),

    "CREEPER!": new Card("Harry Trumble", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            //play immediately
            user[this.parent].removeCards(4,null);
        }
      }),
    "CUTE PENGUIN": new Card("Jordan Davies", ['living', 'Winter', '  Useless'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DA REX": new Card("Michael Calarese", ['rex', 'dinosaur', 'living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DAT CARD": new Card("Jack Reynolds", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //remove 50 points from the other player (only 2 player)
    "DEATH BY UNICORN": new Card("Gilbert Porter", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[findOpponent(this.parent)].decrementPoints(50);
        }
      }),
    "DEATH STAR": new Card("Adam Di Tullio", ['star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DEATHWING": new Card("Rishi Dhakshinamoorthy", ['dragon', 'living', 'dragon boarder'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DEEP FRIED CHICKEN": new Card("Scott Caporn", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DEFENDER OF ARGUS": new Card("Rishi Dhakshinamoorthy", ['living', 'dragon boarder'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DERP": new Card("Coen Heyning", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 30 points
    "DERPASAURUS REX": new Card("Sam Gillard", ['dinosaur', 'rex', 'living', 'creature'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(30);

        }
      }),
    "DETECTIVE REX": new Card("Ashtin Belyea", ['dinosaur', 'rex', 'living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:

        }
    }),
    //gives you 20 points and gives the other player 5 cards
    "DEVIL'S PARTY": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(20);
                users[findOpponent(this.parent)].getCrd(5);
        }
      }),
    "Diamond sword": new Card("Lachie Jones", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Discard pele": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
                users[this.parent].incrementPoints(50);
                users[this.parent].removeCards("hand", null);
        }
      }),
    "Donald trump": new Card("Ben Main", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Don't call me ishmael": new Card("Jamie Bougher", ['living', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Don't recruit me": new Card("Jordan Davies", ['living', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Dora the explorer": new Card("Adam Di Tullio", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DOUBLE CARD USE": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].actionsInTurn = 2;
        }
      }),
    "DR REX": new Card("Michael Calarese", ['rex', 'dinosaur', 'living', 'Medical'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DRAGON EGGS": new Card("Harry Trumble", ['living', 'dragon'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Takes 30 points from other player (only works 2 player)
    "DRAGON NOT A REX": new Card("Michael Calarese", ['dinosaur', 'rex', 'living', 'dragon'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[findOpponent(this.parent)].decrementPoints(30);
          
        }
      }),
    "DROSTE EFFECT": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DUMB RABBIT": new Card("Lachlan Murphy", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            var rabbsOnField = 0;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("Rabbit")){
                  rabbsOnField++;
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
      }),
    "EDGAR": new Card("Andre Nikolich", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "EDWARD SNOWDEN": new Card("Andy Jian", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ELSA": new Card("Ben Richardson", ['living', ' Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 50 points
    "EMOJI": new Card("??", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(50);
        }
      }),
    "EMP": new Card("Matthew Darley", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //give you and the persoon to your left 50 points (only works 2 players)
    "ERMAHGERD 50": new Card("Rishi Dhakshinamoorthy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);
                users[findOpponent(this.parent)].incrementPoints(50);
        }
      }),
    "EVERYTHING IS AWESOME": new Card("Lachie Jones", ['living'], ['Field'], function(functionality) {
        switch(functionality) {
          case "destroyed":
            for(people in users){
              users[people].addtionalPoints -= 20;
            }
          default:
            for(people in users){
              users[people].addtionalPoints += 20;
            }
        }
      }),
    "EXTINCTION": new Card("Lachie Grinbergs", ['dinosaur', 'rex', 'living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "EYE OF SAURON": new Card("Oscar Lewis", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FACE OFF": new Card("Rishi Dhakshinamoorthy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FIELD ROBBER": new Card("Jamie Bougher", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FIND WEIRD RULES": new Card("Cameron Carr", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FIRE BREATHING DUCK": new Card("Oscar Hogan", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FIREBALL": new Card("Will Mardon", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
          users[findOpponent(this.parent)].removeCards("hand",null);
          users[this.parent].decrementPoints(10);
        }
      }),
    "FLANDERS": new Card("Campbell Glendinning", ['living', 'simpsons'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FLYING COWS": new Card("Greg Boeddinghaus", ['living', 'cow'], ['Field'], function(functionality) {
        switch(functionality) {
          case "destroyed":
            pointsToGetFromCowsFlying = 5;
          case "startTurn":
            pointsToGetFromCowsFlying *= 2;
            users[this.parent].incrementPoints(pointsToGetFromCowsFlying);
          default:
            var pointsToGetFromCowsFlying = 5;
            users[this.parent].incrementPoints(pointsToGetFromCowsFlying);
        }
      }),
    "FRAGGLE PUSS": new Card("Jamie Bougher", ['living', 'snagglepuss'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FUTURE PREDATOR": new Card("Oscar Lewis", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "FUZZY KNIGHT": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GALACTUS BARFER OF CARDS": new Card("Lachie Jones", ['living', 'Marvel'], ['specialCounter',"Play"], function(functionality) {
        switch(functionality) {
          case "counter":
          default:
            for (people in users){
              users[people].getCrd(3);
            }
        }
      }),
    "GALACTUS DEVOURER OF CARDS": new Card("Mr Milton", ['living', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            for (people in users){
              users[people].removeCards(3,null);
            }
        }
      }),
    "GAME CHANGER": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //No effects
    "GHOST": new Card("Ben Richardson", ['Useless'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            //spooky
        }
    }),
    //pick up three cards from the deck
    "GLORIOUS BOUNTY": new Card("Mr Milton", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].getCrd(3);
        }
      }),
    "GO TO JAIL": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GOAL AFTER SIREN": new Card("Max Zempilas", ['living', 'blank white man'], ['Field'], function(functionality) {
        switch(functionality) {
          case "gameEnded":
            users[this.parent].incrementPoints(50);
          default:

        }
      }),
    "GOD BLESS AMERICA": new Card("Ben Main", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GOLF": new Card("Coen Heyning", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GRANNY": new Card("Zac Heaton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GRASS WARLOCK": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            var cardsOnField = 0 ;
            for (people in users){
              cardsOnField += (users[people].field.length);
            }
            users[this.parent].incrementPoints(cardsOnField*10);
            users[this.parent].removeCards("hand",null);
        }
      }),
    "GREAT PURGE": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GREEN ARROW": new Card("Oscar Lewis", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "GUARDIAN ANGEL": new Card("Max Zempilas", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HA TAKE THAT": new Card("???", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HACKER": new Card("Will Mardon", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //get 50 points
    "HAPPY BUNNY": new Card("??", ['living', 'Rabbit', 'creature'], ['Field'], function(functionality) {
        switch (functionality) {
            default:
                users[this.parents].incrementPoints(50);
        }
      }),
    //Gives player 50 points
    "HAPPY SNOWMAN": new Card("Jordan Davies", ['living', ' Winter'], ['Field'], function(functionality) {
        switch(functionality) {
          case "startTurn":
            users[this.parent].incrementPoints(10);
          default:
            users[this.parent].incrementPoints(50);

        }
      }),
    "HATS": new Card("Oscar McMath", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HCG": new Card("Scott Caporn", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HE SLIMED ME": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HELPFUL MARSHMALLOW": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HELPFUL SWEET": new Card("Felix Kahn", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HELPING DA REXES": new Card("Micheal Calarese", ['dinosaur', 'rex', 'living'], ['Field'], function(functionality) {
        switch(functionality) {
          case "startTurn":
            users[this.parent].incrementPoints(20);
          default:
            
        }
      }),
    "HIDDEN TREASURES": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HILLARY CLINTON": new Card("Ben Main", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HOLEY CARD": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HONEY BADGER": new Card("Josh Spirek", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "I TAKE FROM YOU YOUR POWER": new Card("Jack Day", ['living', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "IN SOVIET RUSSIA": new Card("Andy Jian", ['living', ' Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INFINITE SHELDON": new Card("Oscar Lewis", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INSPECTOR REX": new Card("Micheal Calarese", ['dinosaur', 'rex', 'living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INTERNET SEARCH": new Card("Harry Trumble", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INTERRUPTING COW": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INTERVENTION": new Card("Will Mardon", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "IT'S A TRAP": new Card("Mr Milton", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 50 points
    "IT'S CHRISMAS": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(50);

        }
      }),
    //Gives player 0.9000 points
    "IT'S OVER 9000": new Card("Jamie Bougher", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(0.9000);

        }
      }),
    "JESASE": new Card("Joshua Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "JOKER'S CHOICE": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "JOOR WELCOME": new Card("Michael Calarese", ['living'], ['Field'], function(functionality) {
        switch(functionality) {
          case "startTurn":
            if(TimeOnFieldJoorWelcome >= 3){
              users[this.parent].destroyCard("JOOR WELCOME");
            }
            else{
              users[this.parent].incrementPoints(50);
              TimeOnFieldJoorWelcome++;
            }
          default:
            var TimeOnFieldJoorWelcome = 0;
        }
      }),
    "JUST DO IT": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].getCrd(2);
        }
      }),
    "KIDNAP THE COOKIE MONSTER": new Card("Cody Stump", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "KILLER BEAR": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "KING OF THE TRASH": new Card("Max Zempilas", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "KINGPIN": new Card("Mr Lindorff", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "KITTY SAMURAI": new Card("Jack Day", ['living', 'cute'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "KOALAGEDDON": new Card("Lachie Henderson", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //takes 70 points off the other person (completely wrong with more than 2 people)
    "KYLO RENS LIGHTSABER": new Card("Jamie Bougher", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[findOpponent(this.parent)].decrementPoints(70);
        }
      }),
    "LEAGUE OF NINJAS": new Card("Charles Worthington-O'Leary", ['living', 'ninja', 'dragon', 'creature'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LEGO BUILD": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            refillDeck();
        }
      }),
    "LET THERE BE REX": new Card("Micheal Calarese", ['dinosaur', 'rex', 'living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LEVEL THE PLAYING FIELD": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            for (people in users){
              users[people].score = users[this.parent].score;
            }
        }
      }),
    "LIGHT VS DARK": new Card("Charles Begley", ['living', 'narwhal', 'Water', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LIZARD PEOPLE": new Card("ben main", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LLAMA BATH": new Card("Lachlan Henderson", ['living', 'llama', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LLAMASAURUS": new Card("Lachie Henderson", ['rex', 'dinosaur', 'living', 'llama'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LORD JARAXXUS": new Card("Rishi Dhakshinamoorthy", ['living', 'dragon boarder'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LUCKY DAY": new Card("Coen Heyning", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LUCKY TROLL": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MAD DAD": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MAGICAL CHICKEN": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MAGICAL CHOOK WIRE": new Card("James Lee", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MALYGOS": new Card("Rishi Dhakshinamoorthy", ['living', 'dragon', 'dragon boarder'], ['Play'], function(functionality) {
          switch(functionality) {
            case "destroyed":
                users[this.parent].addtionalPoints -= 20;
            default:
                users[this.parent].addtionalPoints += 20;
        }
      }),
    "MAN CHICKEN": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MAN WITH SWORDS": new Card("Josh Spirek", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MARIO POWER": new Card("Ms De Sousa", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MARSHMELLOW MONSTER": new Card("Max Gunning", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MAXIMUM FAILURE": new Card("Lachie Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MECHA BEAR": new Card("Lachlan Henderson", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 30 points
    "MICHAEL JORDAN CARD!": new Card("Jordan Davies", ['Cool'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(30);
            users[this.parent].cool += 9001;
        }
      }),
    "MINE TURTLE": new Card("Jamie Bougher", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MIRRORMAN": new Card("Christopher McCluskey", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MONSTER ASSASIN": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MORE I WANT MORE": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].decrementPoints(20);
                users[this.parent].getCrd(4);
        }
      }),
    "MOST USELESS CARD EVER": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MR MONSTER": new Card("Monte McGrath", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MUD SLIDE": new Card("Will Mardon", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].destroyCard("fieldWipe")
            users[this.parent].decrementPoints(30);
        }
      }),
    "MURICA": new Card("Ben Main", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MUSICAL CHAIRS": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "MUSTARD": new Card("Max Zempilas", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "NARWHALS ARE BADASS": new Card("Charles Begley", ['living', 'narwhal', 'Water'], ['Field'], function(functionality) {
        switch(functionality) {
          case "gameEnded":
            //check if narwhal
            users[this.parent].incrementPoints(50);
          default:
      
        }
    }),
    //gives you 50 points and takes 50 points off another player (only works with 2 players)
    "NECROMANCER": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);
                users[findOpponent(this.parent)].decrementPoints(50);
        }
      }),
    "NEIL DE GRASSE TYSON": new Card("Andy Jian", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 25 points
    "NESSIE": new Card("Harry Trumble", ['living', 'Water', 'creature'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(25);
        }
      }),
    "NINJA": new Card("Lachlan Henderson", ['living', 'ninja'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            for (people in users){
              if (users[people].score < 50){
                users[people].score = 50;
              }
            }
        }
      }),
    "NON-BELIEVER": new Card("Cameron Minchin", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "NORTH POLE": new Card("Jordan Davies", ['Winter', ' Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "O'BE ONE": new Card("Charles Begley", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "OLD MAN SCIENTIST": new Card("???", ['living', 'Medical'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "OMEGA SHIELD": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ONYXIA": new Card("Rishi Dhakshinamoorthy", ['dragon', 'living', 'dragon boarder'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "OPPOSITE DAY": new Card("Cameron Minchin", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PARTY RABBIT": new Card("Lachlan Murphy", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            var rabbsOnField = 0;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("Rabbit")){
                  rabbsOnField++;
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
      }),
    "PAUSE REWIND": new Card("Cameron Carr", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PEEPING TOM": new Card("David Chen", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PEEPO PIG": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PFUDOR": new Card("Jamie Bougher", ['living', 'Rainbow', ' Useless'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PIG MAN": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].removeCards(3,null);
                users[this.parent].incrementPoints(30);
        }
      }),
    "PIGGY POWER": new Card("Michael Calarese", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(30);
                users[this.parent].getCrd(1);
        }
      }),
    "PINAPPLE POWER": new Card("Ms Auld", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PLANTASAURUS": new Card("Karan Archar", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PLAYER ONE": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PLOT TWIST": new Card("Harry Trumble", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "PLUTO": new Card("Ben Richardson", ['Useless'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 50 points
    "PORTAL": new Card("Lachlan Murphy", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(50);
        }
    }),
    //get 50 points and an extra card
    "Pot of gold": new Card("Jordan Davies", ['Rainbow'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].incrementPoints(50);
                users[this.parent].getCrd(1);
        }
      }),
    "Potato of fun": new Card("Michael Calarese", ['living', ' Useless'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Pow": new Card("Vashit Rambal", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Power to the max": new Card("Max Zempilas", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Pringle man": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            var potatoInPlay;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("potato")){
                  potatoInPlay++;
                }
              }
            }
            users[this.parent].incrementPoints(30*potatoInPlay);
        }
      }),
    "Professor mcgonagall": new Card("Lachie Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Pugasaurus Rex": new Card("Andre Nikolich", ['living', 'dinosaur', 'cute', 'rex'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Purple man": new Card("Josh Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Raging bull": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "RAINBOWOSAURUS": new Card("Toby Cann", ['living', 'Rainbow', 'dinosaur'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "RAPTOR HANDS": new Card("???", ['living', 'dinosaur', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 51 points
    "REBEL": new Card("Lachie Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(51);
        }
      }),
    "RECRUIT! NICK FURY": new Card("Mr Milton", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "REFILL YOUR MIGHTY HAND": new Card("Mr Milton", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].removeCards("hand",null);
            users[this.parent].getCrd(5);
        }
      }),
    "ABSORB": new Card("Max Gunning", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ACID RAIN": new Card("James Lee", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ASSORTED ANGRY TOWNSPEOPLE": new Card("James Lee", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "AUSSIE AUSSIE AUSSIE": new Card("Lachlan Murphy", ['living', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "BO BO BO BO BO BO BO": new Card("Lachlan Murphy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CAN'T GET THE BUTCHER BACK": new Card("Cameron Minchin", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
        
        }
      }),
    //Gives player 25 points
    "CAT GOT THE YARN": new Card("Ryan Cowan", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(25);
        }
      }),
    "CHICKEN ON A RAFT": new Card("Lachlan Murphy", ['living', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "CHILDHOOD RUINED": new Card("Joel Newton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 50 points and takes 20 points from other player (only works with 2 players)
    "COWBOY CAT WITH GOLDEN GUNS RIDING A UNICORN": new Card("Lachlan Murphy", ['living', 'Rainbow'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(50);
            users[findOpponent(this.parent)].decrementPoints(20);
        }
      }),
    "COWS": new Card("Pat?", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "DARK DC": new Card("Jasper Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "EAT THE RICH": new Card("Tyler Sprunt", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "EWOKS EAT PEOPLE": new Card("Mr Milton", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //every player looses 1 card + 10 points
    "EXTERMINATE": new Card("Max Gunning", [], ['Play'], function(functionality) {
        switch (functionality) {
            default:
                for (people in users){
                  users[people].decrementPoints(10);
                  users[people].removeCards(1, null);
                }
        }
      }),
    "FALCREM": new Card("Max Gunning", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "HELLO THERE": new Card("Tyler Sprunt", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INCONSPICUOUS DISGUISE": new Card("James Lee", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "INDEPENDENCE DAY": new Card("Cameron Minchin", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "IT'S RAINING MEN": new Card("Lachlan Murphy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "JOHN WICK": new Card("Tyler Sprunt", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LLAMAS WITH HATS": new Card("Lachlan Murphy", ['living', 'llama', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "LUCK OF THE IRISH": new Card("Lachlan Murphy", ['living', 'Rainbow'], ['Field'], function(functionality) {
        switch(functionality) {
          case "incrementPoints":
            users[this.parent].incrementPoints(10);
          default:
            
        }
      }),
    "MINE MINE MINE": new Card("Mr Milton", ['living', 'star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "Get Down MR PRESIDENT": new Card("Cameron Minchin", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 100 points
    "NEADERTHAL FROM THE FUTURE": new Card("James Lee", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(100);
        }
      }),
    "PACIFISM": new Card("Lachlan Murphy", ['living', 'Rainbow', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "POT OF GREED": new Card("Jasper Coombes-Watkins", [], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].getCrd(2);
                users[this.parent].incrementPoints(20);
        }
      }),
    "SACRIFICIAL LAMB": new Card("Lachlan Murphy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
          //change for more than 2 players
            users[this.parent].score = 0;
            users[findOpponent(this.parent)].score = 0;
            users[this.parent].cards = [];
            users[findOpponent(this.parent)].cards = [];
            users[this.parent].field = [];
            users[findOpponent(this.parent)].field = [];
        }
      }),
    "SAMARA": new Card("James Patrikeos", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SAMSUNG GALAXY S7": new Card("Charlie Begley", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SILURIAN": new Card("Max Gunning", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SPIDER HAM": new Card("Tyler Sprunt", ['living', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SQUID GUN": new Card("James Lee", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 90 points
    "STOP BE HUMBLE": new Card("Lachlan Murphy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            if (users[this.parent].cool > 0){
              users[this.parent].incrementPoints(90);
            }
        }
      }),
    "SWIPER NO SWIPING": new Card("Lachlan Murphy", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TEAM DEATH MATCH": new Card("Matthew Mitchell", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TIME LORD SCIENCE": new Card("Max Gunning", [], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].getCrd(this.parent.cards.length);
        }
      }),
    "TOILET HUMOUR": new Card("Zach Templeman", ['living', 'Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "UNDERWEAR SPIDER-GUY": new Card("Joel Newton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "UPSIDE DOWN": new Card("Cameron Minchin", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            /*while (0<deck1.length)
            {
                fillDeck.push(deck1[-1]);
                deck1.splice(-1, 1);
            }
            while (0<fillDeck.length)
            {
                deck1.push(fillDeck[0]);
                fillDeck.splice(0, 1);
            }*/
        }
      }),
    "YOU TRICKED A POLAR BEAR": new Card("Flynn Dickson", ['living', ' Winter', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ZYGON": new Card("Max Gunning", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "RESET": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "RESURREX": new Card("Michael Calarese", ['living', 'rex', 'dinosaur'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "REVERSE HOLLOWING": new Card("Oscar Lewis", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "REVERSE": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 50 points
    "REX WILL RULE": new Card("Michael Calarese", ['living', 'rex', 'dinosaur'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(50);
        }
      }),
    //Gives player 30 and takes 10 from opponent (only works with 2 players)
    "RICHIE RICH": new Card("Oliver Mitteregger", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(30);
            users[findOpponent(this.parent)].decrementPoints(10);
        }
      }),
    "ROBIN HOOD": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
        }
      }),
    "ROBO SHREK": new Card("Oliver Mitteregger", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SACRIFICIAL PACT": new Card("Michael Calarese", ['living', 'dragon boarder'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SCORORER MISTAKE": new Card("???", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //gives you 10 points and takes 10 points away from everyone else (only works with 2 players)
    "SCROOGE MCDUCK": new Card("Michael Calarese", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
            //change for more than 2 players
                users[this.parent].incrementPoints(10);
                users[findOpponent(this.parent)].decrementPoints(10);
        }
      }),
    "SECRET AGENT": new Card("Paul Kikiros", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SHREK REKT": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SKELATOR": new Card("Michael Calarese", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //steal a card from a player and get 25 points
    //PROBABLY DOESN'T WORK
    "SKY DIVE": new Card("Lachlan Woodall", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[findOpponent(this.parent)].cards[0].parent = this.parent;
                users[this.parent].incrementPoints(25);
        }
      }),
    "SLAUGHTERHOUSE": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SLEEP PARALYSIS": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SLENDERMAN": new Card("Harry Trumble", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SLIME": new Card("Josh Spirek", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 10 points
    "SMALL CHILD": new Card("Michael Calarese", ['living','small child'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(10);
        }
      }),
    "SMEXY REX": new Card("Michael Calarese", ['living', 'dinosaur', 'rex'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SNAGGLEPUSS": new Card("Cameron Hunt", ['living', 'snagglepuss'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SNOWMAN FORCEFIELD": new Card("Mr Milton", ['living', ' Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SOCIALDARWINSISM": new Card("Harry Trumble", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SONIC SPEED": new Card("Tristan Porter", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SPACE JAMS": new Card("Mr Milton", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives player 1 point
    "SPARE CHANGE": new Card("Harry Trumble", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(1);
        }
      }),
    "SPEED UP THE PACE": new Card("Timothy Chapman", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "STICKMAN UPGRADED": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          case "startTurn":
            if(TimeOnFieldStickManUpgraded >= 3){
              users[this.parent].destroyCard("STICKMAN UPGRADED");
            }
            else{
              Turn --;//lazy way<---
              TimeOnFieldStickManUpgraded++;
            }
          default:
            var TimeOnFieldStickManUpgraded = 0;
        }
      }),
    "STATEGIC ADVANTAGE": new Card("Jordan Davies", ['living', 'blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "STRAWMAN": new Card("Harry Trumble", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SUN COMES OUT": new Card("???", ['living', ' Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SUPERNOVA": new Card("Harry Trumble", ['uncounterable'], ['Field'], function(functionality) {
        switch(functionality) {
          case "startTurn":
            if(TimeOnFieldSuperNova >= 3){
              users[this.parent].destroyCard("fieldWipe");
              for (people in users){
                if(users[people].score >= 0){
                  users[people].decrementPoints(30);
                }
                else{
                  users[people].incrementPoints(30);
                }
                users[people].removeCards("hand",null);
                users[people].getCrd(1);
              }
            }
            else{
              TimeOnFieldSuperNova++;
            }
            default:
          var TimeOnFieldSuperNova = 0;
        }
      }),
    "SUSPICIOUS MONKEY": new Card("Cameron Carr", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SWIFTY NINJAS": new Card("Jordan Davies", ['living', 'Ninja'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "SWITCHEROO": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            if (users[this.parent].score < 0){
              users[this.parent].score *= -1;
            }
            else if(users[this.parent].score > 0){
              users[this.parent].score *= -1;
            }
        }
      }),
    "TAGGLEPUSS": new Card("Jamie Bougher", ['living', 'snagglepuss'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives the player 20 points
    "TDOGGYREX": new Card("Michael Calarese", ['rex', 'dinosaur', 'Cool'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
                users[this.parent].incrementPoints(20);
                users[this.parent].cool++;
        }
      }),
    "TEA ATTACK": new Card("Will Taylor", ['living', 'blank white man'], ['Field'], function(functionality) {
        switch(functionality) {
          case "getCards":
          default:
            
        }
      }),
    "TEAM UP": new Card("???", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TERRIAN FALCON": new Card("Tommy Andrews", [], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[findOpponent(this.parent)].removeCards(3);
                users[findOpponent(this.parent)].incrementPoints(20);
        }
      }),
    "THA COOL CARD": new Card("Lachie Jones", ['living', 'Cool'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE ALMIGHTY BLORB": new Card("Jack Day", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE BIG BAD BOSS WOLF": new Card("Jordan Davies", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE CASH COW": new Card("Josh Gilbert", ['living', 'cow'], ['Field'], function(functionality) {
        switch(functionality) {
          case "destroyed":
            for(people in users){
              users[people].incrementMultiplier /= 2;
              users[people].decrementMultiplier /= 2;
            }
          default:
            for(people in users){
              users[people].incrementMultiplier *= 2;
              users[people].decrementMultiplier *= 2;
            }
        }
      }),
    "THE COLLECTOR": new Card("Lachie Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE EQUILISER": new Card("Lachie Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            for (people in users){
              if (users[this.player].cards.length < users[people].cards.length){
                users[people].removeCards((users[people].cards.length-users[this.player].cards.length),null);
              }
              else if (users[this.player].cards.length > users[people].cards.length){
                users[people].getCrd((users[this.player].cards.length-users[people].cards.length),null);
              }
            }
        }
      }),
    "THE FACE": new Card("Tom Heyning", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
    }),
    //Divides everyones score by 10 (only works with 2 players)
    "THE GREAT DIVIDE": new Card("Jordan Davies", ['blank white man'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                for (user in users) {
                    users[this.parent].score /= 10;
                    users[findOpponent(this.parent)].score /= 10;
                }
        }
      }),
    "THE NUKE": new Card("Tristan Porter", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].destroyCard("fieldWipe");
        }
      }),
    "THE RING OF POWER": new Card("Oscar Lewis", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE SHEEP EXPLODES THEREFORE THE COW EXPLODES": new Card("Jamie Bougher", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE STUPID IT BURNS": new Card("Harry Trumble", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THE WHISTLER": new Card("Luke Calarese", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THERE CAN ONLY BE ONE COUNTER": new Card("Coen Heyning", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
           
        }
      }),
    "THERE CAN BE ONLY ONE": new Card("Josh Gilbert", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
            default:
                users[this.parent].removeCards(users[this.parent].card.length - 1, null);
        }
      }),
    //Gives player 20 points
    "THEY'RE TAKING THE HOBBITS TO ISENGARD": new Card("Harry Trumble", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(20);
        }
      }),
    "THIEF CITY": new Card("Charles Worthington-O'Leary", ['living', 'Ninja'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "THREE MUSKETEERS": new Card("???", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TIME LIMIT": new Card("Cameron Minchin", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TOMATO SAUCE": new Card("Max Zempilas", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TOO MANY MUPPETS": new Card("Mr Milton", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TOXIN SPIDER": new Card("Joshua Jones", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TRIPLE BACON CHEESEBURGER": new Card("Mr Milton", [], ['Field'], function(functionality) {
        switch(functionality) {
          case "destroyed":
            for(people in users){
              users[people].cardsToPlay = 1;
            }
          default:
            for(people in users){
              users[people].cardsToPlay = 3;
            }
        }
      }),
    "TROLL": new Card("Andrew Lawrance", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TROLL REX": new Card("Michael Calarese", ['living', 'rex', 'dinosaur'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TRUMP STEAKS": new Card("Ms DeSousa", ['living', ' America'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TURKEY": new Card("Jamie Bougher", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "TURTLE BUNNY": new Card("Jordan Davies", ['living', 'Rabbit'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ULTIMATE CARDORNATOR": new Card("Josh Spirek", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            //change for more than 2
            for (crds in users[findOpponent[this.parent]].cards){
              users[this.parent].cards.push(crds);
            }
            users[findOpponent[this.parent]].cards = [];
            updateCards();
        }
      }),
    "ULTIMMATE PIKA": new Card("Zach Templeman", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ULTIMATE SWAG": new Card("Ryland Sula", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "ULTRA KEY": new Card("Jordan Davies", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "UNHAPPY SNOWMAN": new Card("Mr Milton", ['Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "UNICORN RABBIT": new Card("Lachlan Murphy", ['living', 'Rabbit', 'Rainbow'], ['Field'], function(functionality) {
        switch(functionality) {
          default:
            var rabbsOnField = 0;
            for (person in users){
              for (fieldCard in users[person].field){
                if (fieldCard.tags.includes("Rabbit")){
                  rabbsOnField++;
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
      }),
    "UPGRADE IT": new Card("Lachie Jones", ['Rainbow'], ['Field'], function(functionality) {
        switch(functionality) {
          case "startTurn":
            if (users[`Player${Turn}`].actionsInTurn >= 2){
              //do nothing 
            }
            else{
              users[`Player${Turn}`].actionsInTurn = 2;
            }
            //lazy way to do the get card
            users[`Player${Turn}`].getCrd(1);
          default:

        }
      }),
    //Takes 30 points from opponent gives player 20 points (only works 2 players)
    "VAMPIRE BAT": new Card("Tristan Porter", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
          users[this.parent].incrementPoints(20);
          users[findOpponent(this.parent)].decrementPoints(30);
        }
      }),
    "WAAAHMBULANCE": new Card("Lachie Henderson", ['living', 'Medical'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "WASP": new Card("Ben Richardson", ['living', 'avengers', 'Marvel'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "WHY BURN THEM": new Card("Michael Calarese", ['living', 'rex', 'dinosaur'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "WHY WOULD YOU TRAIN A DRAGON": new Card("Lachlan Henderson", ['living', 'dragon'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "WIN WIN": new Card("Jamie Bougher", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    //Gives both players in game 2 cards (only works with 2 players)
    "WINTER IS COMING": new Card("Ms O'Neill", ['living', ' Winter'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
          for (people in users){
            users[people].getCrd(2);
          }
        }
      }),
    //Gives person who played 50 points
    "X-WING": new Card("Adam Di Tullio", ['star wars'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            users[this.parent].incrementPoints(50);
        }
      }),
    "YEAR 12 EXAM": new Card("Ben Richardson", ['living', 'Medical'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "YOU SUNK MY BATTLESHIP": new Card("Josh Gilbert", ['Water'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
    "YOUR FAVORITE TOY": new Card("Ben H.", [], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      }),
      // game breaking
    "YSERA": new Card("Rishi Dhashinamoorthy", ['living', 'dragon', 'dragon boarder'], ['Field'], function(functionality) {
        switch(functionality) {
          case "incrementPoints":
            users[this.parent].getCrd(Math.floor(users[this.parent].score-prevPoints));
          default:
            var prevPoints = users[this.parent].score;
        }
      }),
    "ZEUS POTATO": new Card("Tam Seton-Browne", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            for (people in users){
              //doubles for each potato
              var potatoInPlay = 0;
              if(users[people].field.includes("Potato of fun")){
                potatoInPlay++;
              }
            }
            users[this.parent].incrementPoints(50*(potatoInPlay+1));
        }
      }),
    "ZEUS": new Card("Ben Richardson", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            //zap zap
        }
      }),
    "ZOMBIE APOCALYPSE": new Card("Oscar Lewis", ['living'], ['Play'], function(functionality) {
        switch(functionality) {
          default:
            
        }
      })
};