var net = require('net');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');
var HOST = '';
var PORT = 4000;
var deck1 = ["2012","A LOT OF HELP","ANGRY RABBIT","AROUND THE WORLD","BUNGEE!","CALM RABBIT","CARROT OF SURRENDER","CCGS BOY","CENTRELINK","CHEZBURGER","COOKIE MONSTER","COOKIE","COOKIE","COOKIE","COOLEST CARD EVER","CRAZY RABBIT","DEATH BY UNICORN","DEVIL'S PARTY","Discard pele","DRAGON NOT A REX","DUMB RABBIT","EMOJI","ERMAHGERD 50","EVERYTHING IS AWESOME","FIREBALL","FLYING COWS","GALACTUS BARFER OF CARDS","GALACTUS DEVOURER OF CARDS","GHOST","GLORIOUS BOUNTY","GOAL AFTER SIREN","GRASS WARLOCK","HAPPY BUNNY","HAPPY SNOWMAN","HELPING DA REXES","IT'S CHRISMAS","IT'S OVER 9000","JOOR WELCOME","JUST DO IT","KYLO RENS LIGHTSABER","LEGO BUILD","LEVEL THE PLAYING FIELD","MALYGOS","MICHAEL JORDAN CARD!","MORE I WANT MORE","MUD SLIDE","NARWHALS ARE BADASS","NECROMANCER","NESSIE","NINJA","PARTY RABBIT","PFUDOR","PIGGY POWER","PLUTO","PORTAL","Pot of gold","Potato of fun","Potato of fun","Potato of fun","Pringle man","REFILL YOUR MIGHTY HAND","CAT GOT THE YARN","COWBOY CAT WITH GOLDEN GUNS RIDING A UNICORN","LUCK OF THE IRISH","NEADERTHAL FROM THE FUTURE","POT OF GREED","SACRIFICIAL LAMB","STOP BE HUMBLE","TIME LORD SCIENCE","REX WILL RULE","RICHIE RICH","SCROOGE MCDUCK","SKY DIVE","SMALL CHILD","SMALL CHILD","SPARE CHANGE","STICKMAN UPGRADED","SUPERNOVA","SWITCHEROO","TDOGGYREX","TERRIAN FALCON","THE CASH COW","THE EQUILISER","THE GREAT DIVIDE","THE NUKE","THERE CAN BE ONLY ONE","THEY'RE TAKING THE HOBBITS TO ISENGARD","TRIPLE BACON CHEESEBURGER","ULTIMATE CARDORNATOR","UPGRADE IT","VAMPIRE BAT","WINTER IS COMING","YSERA","ZEUS POTATO"];
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
    this.cool = 0;
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

    this.incrementPoints = function(amount) {
        //increases the person's score by amount while adding any additional things to take into acount
        this.score += (amount * this.incrementMultiplier * this.scoreMultiplier * 
        this.scoreMultiplier * this.incrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
        this.checkField("incrementPoints",this.name);
    }

    this.decrementPoints = function(amount) {
        //decreases the person's score by amount while adding any additional things to take into acount
        this.score -= (amount * this.decrementMultiplier * this.scoreMultiplier * 
        this.scoreMultiplier * this.decrementMultiplier + this.addtionalPoints);
        //add thing for when score is increased like get cards and make sure it does not repeat with getcrds
        this.checkField("decrementPoints",this.name);
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
            this.cards.splice((this.findCard(name)),1);
            if (cards[name] != undefined){
              cards[name].ability(use);
            }
            else{
              console.log(`no card of ${name} found in ${cards} so ${cards[name]} = undefined`);
            }
            if (cards[name].functionality.includes("Field")){
                this.field.push(name);
            }
            else if (cards[name].functionality.includes("FieldOp")){
                users[findOpponent(this.parent)].field.push(name);
            }
            else if (cards[name].functionality.includes("Play")){
                discardPile.push(name);
            }
            else{
                console.error(`No functionality of ${functionality} avalible`);
            }
            this.actionsInTurn--;
            updateCards()
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
                this.checkField("endTurn",this.name);
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
            this.checkField("removeCards",this.name);
            if (this.cards != undefined){
              for (handCards in this.cards){
                  discardPile.push(`${this.cards[handCards]}`);
              }
              this.cards = [];
            }
        }
        else if (special == null){
            if (this.cards.length<amount){
                this.cards = [];
                this.checkField("removeCards",this.name);
            }
            else{
                for (var cardsToRemove = 0 ; cardsToRemove < amount;cardsToRemove++ ){
                    var ranNum = Math.floor(Math.random() * this.cards.length);
                    discardPile.push(`${this.cards.splice(ranNum,1)}`);
                    this.cards.splice(ranNum,1);
                    this.checkField("removeCards",this.name);
                }
            }
        }
        else{
            //add extra else if's to only remove must plays,neggs,which cards
        }
    }

    this.destroyCard = function(cardToDestroy){
        //destroy card on feild
        if (cardToDestroy == "fieldWipe"){
            //add stuff to check for resistent cards
            for (people in users){
                // console.log("cardDestroyed all");
                for (fieldCards in this.field){
                    discardPile.push(this.field[fieldCards]);
                }
                users[people].field = [];
                users[people].checkField("cardDestroyed",[this.name,"all"]);
            }
        }
        else{
            for (card in cardToDestroy){
                this.field.splice(this.findCard(card),1);
                this.checkField("cardDestroyed",[this.name,card]);
                discardPile.push(`${this.cards[card]}`);// change if tag == return to hand or other special
            }
        }
    }

    this.getCrd = function(amount){
        // console.log(deck1);
        // console.log(discardPile);
        if (amount != undefined){
            if(deck1.length < amount){
                refillDeck();
            }
            for (numCardsGet = 0;numCardsGet<amount;numCardsGet++)
            {
                //draws the first card from the draw pile
                if (cards[deck1[0]] != undefined){
                  cards[deck1[0]].parent = this.name;// if this line errors the most likely case is that cards[deck1[0]] == undefined, so you need to add the right name into deck1 or cards
                  this.cards.push(deck1[0]);
                  deck1.splice(0, 1);
                  this.checkField("getCards",this.name);
                  // updateCards(this.name,this.cards);//uc cards 
                }
                else{
                  console.log(`card on top of draw is undefined as ${deck1[0]} of ${deck1} is not in cards as ${cards[deck1[0]]} = undefined`)
                  deck1.splice(0,1);
                  numCardsGet--;
                }
                
            }
        }
    }

    this.checkField = function(typeCheck,extraInfo){
        if (typeCheck == "startTurn"){
          //check FieldStartTurn
          if(users[extraInfo].field != undefined){
            for (fieldCard in users[extraInfo].field){
              if (cards[fieldCard] != undefined){
                if (cards[fieldCard].tags != undefined){
                  if (cards[fieldCard].tags.includes("FieldStartTurn")){
                      users[extraInfo].playCard(fieldCard,"startTurn");
                  }
                }
              }
            }
          }
        }
        else if(typeCheck == "endTurn"){
            //check FieldEndTurn
        }
        else if(typeCheck == "decrementPoints"){
            //check FieldDecrementPoints
        }
        else if(typeCheck == "incrementPoints"){
          //check FieldIncrementPoints
        if(users[extraInfo].field != undefined){
            for (fieldCard in users[extraInfo].field){
              if (cards[fieldCard] != undefined){
                if (cards[fieldCard].tags != undefined){
                  if (cards[fieldCard].tags.includes("FieldIncrementPoints")){
                      users[extraInfo].playCard(fieldCard,"incrementPoints");
                  }
                }
              }
            }
          }
        }
        else if(typeCheck == "getCards"){
          //check FieldGetCards
          if(users[extraInfo].field != undefined){
            for (fieldCard in users[extraInfo].field){
              if (cards[fieldCard] != undefined){
                if (cards[fieldCard].tags != undefined){
                  if (cards[fieldCard].tags.includes("FieldGetCards")){
                      users[extraInfo].playCard(fieldCard,"getCards");
                  }
                }
              }
            }
          }
        }
        else if(typeCheck == "removeCards"){
          //check FieldRemoveCards

        }
        else if(typeCheck == "cardDestroyed"){
            //check FieldCardDestroyed
          if(extraInfo[1] != "all"){
            if(users[extraInfo[0]].field != undefined){
              if (cards[extraInfo[1]] != undefined){
                if (cards[extraInfo[1]].tags != undefined){
                  if (cards[extraInfo[1]].tags.includes("FieldCardDestroyed")){
                    users[extraInfo[0]].playCard(extraInfo[1],"cardDestroyed");
                  }
                }
              }
            }
          }
          else{
            //played for all users
            for (people in users){
              if(users[people].field != undefined){
                for (fieldCard in users[people].field){
                  if (cards[fieldCard] != undefined){
                    if (cards[fieldCard].tags != undefined){
                      if (cards[fieldCard].tags.includes("FieldCardDestroyed")){
                          users[people].playCard(fieldCard,"cardDestroyed");
                      }
                    }
                  }
                }
              }
            }
          }
        }
        else if(typeCheck == "gameEnded"){
          //check FieldGameEnded
          for (people in users){
            if(users[extraInfo].field != undefined){
              for (fieldCard in users[extraInfo].field){
                if (cards[fieldCard] != undefined){
                  if (cards[fieldCard].tags != undefined){
                    if (cards[fieldCard].tags.includes("FieldGameEnded")){
                        users[extraInfo].playCard(fieldCard,"gameEnded");
                    }
                  }
                }
              }
            }
          }
        }
        else{
            console.error(`no check of ${typeCheck} avalible`);
        }
    }

    this.startTurn = function(playingPLayer){
        if (this.TurnRun == "No"){
            //add things that activate at the start of a turn
            this.getCrd(1);
            this.actionsInTurn = this.cardsToPlay;
            this.TurnRun = "Yes";
            this.checkField("startTurn",this.name);
            updateCards(this.cards);
            updateScore();

            
            
            /*nice little funtion that helps with testing 
            if (deck1.length == null){
              gameRun = "ending";
            }
            else{
              for (var playCardsFast = 0; playCardsFast<this.actionsInTurn;){
                if ((this.cards[0] != undefined)&&(this.cards[0] != 0)){
                  this.playCard(this.cards[0],null);
                }
                else{
                  this.actionsInTurn--;
                }
              }
              if (this.TurnRun == "Yes"){
                this.endTurn();
              }
            }
            */
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
    users["Player1"].checkField("gameEnded",null);
    gameRun = "Not";
    gameFinnished = "Yes";
    if (users["Player1"].score == users["Player2"].score){
        console.log("The game was a Tie");
        //update score and print
    }
    else if(users["Player1"].score > users["Player2"].score){
        console.log("Player 1 wins!");
    }
    else if(users["Player1"].score < users["Player2"].score){
        console.log("Player 2 wins!");
    }
    else{
        console.error("No one won???");
    }
}

//deck shuffle
function shuffleDeck() {
    // console.log(deck1);
    while (0<deck1.length)
    { 
        var ranNum = Math.floor(Math.random() * deck1.length);
        fillDeck.push(deck1[ranNum]);
        deck1.splice(ranNum, 1);
    }
    // console.log(`Shuffle funciton after shuffle${fillDeck}`);
    while (0<fillDeck.length)
    {
      if (fillDeck[0] == undefined||fillDeck[0] == ''){ 
          fillDeck.splice(0,1);
      }
      else{
          deck1.push(fillDeck[0]);
          fillDeck.splice(0, 1);
      }
    }
}

//discards shuffle
function refillDeck() {
    // console.log(discardPile);
    var cardsInDis = discardPile.length;
    while (0<cardsInDis)
    {
        deck1.push(discardPile[0]);
        discardPile.splice(0,1);
        cardsInDis--;
    }
    shuffleDeck();
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
    sendText(users["Player1"],`uc ${users["Player1"].cards.join()}|${users["Player1"].field.join()}|${users["Player2"].field.join()}|${users["Player2"].cards.length}|${discardPile[discardPile.length-1]}`);
    sendText(users["Player2"],`uc ${users["Player2"].cards.join()}|${users["Player2"].field.join()}|${users["Player1"].field.join()}|${users["Player1"].cards.length}|${discardPile[discardPile.length-1]}`);
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
// if you want to go to top of the cards type in serch "topCards"
cards = {

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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("Rabbit")){
                      rabbsOnField++;
                    }
                  }
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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("Rabbit")){
                      rabbsOnField++;
                    }
                  }
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
    "CENTRELINK": new Card("Adam Di Tullio", ['FieldStartTurn'], ['Field'], function(functionality) {
        switch(functionality) {
          case "Worked":
          case "startTurn":
              users[this.parent].incrementPoints(2);
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
            var cookieInPlay = 1;
            for (person in users){
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("cookie")){
                      cookieInPlay++;
                    }
                  }
                }
              }
            }
            users[this.parent].incrementPoints(25*cookieInPlay);
        }
      }),
    "COOKIE": new Card("Adam Di Tullio", ['Useless',"cookie"], ['Field'], function(functionality) {
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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("Rabbit")){
                      rabbsOnField++;
                    }
                  }
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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("Rabbit")){
                      rabbsOnField++;
                    }
                  }
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
    "EVERYTHING IS AWESOME": new Card("Lachie Jones", ['living','cardDestroyed'], ['Field'], function(functionality) {
        switch(functionality) {
          case "cardDestroyed":
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
    "FLYING COWS": new Card("Greg Boeddinghaus", ['living', 'cow','FieldStartTurn','cardDestroyed'], ['Field'], function(functionality) {
        switch(functionality) {
          case "cardDestroyed":
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
    "GOAL AFTER SIREN": new Card("Max Zempilas", ['living', 'blank white man','FieldGameEnded'], ['Field'], function(functionality) {
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
              if (users[people].field != null){}
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
                users[this.parent].incrementPoints(50);
        }
      }),
    //Gives player 50 points
    "HAPPY SNOWMAN": new Card("Jordan Davies", ['living', ' Winter','FieldStartTurn'], ['Field'], function(functionality) {
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
    "HELPING DA REXES": new Card("Micheal Calarese", ['dinosaur', 'rex', 'living','FieldStartTurn'], ['Field'], function(functionality) {
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
    "JOOR WELCOME": new Card("Michael Calarese", ['living','FieldStartTurn'], ['Field'], function(functionality) {
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
    //change for more than 2 palyers
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
    "MALYGOS": new Card("Rishi Dhakshinamoorthy", ['living', 'dragon', 'dragon boarder','cardDestroyed'], ['Field'], function(functionality) {
          switch(functionality) {
            case "cardDestroyed":
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
    "NARWHALS ARE BADASS": new Card("Charles Begley", ['living', 'narwhal', 'Water','FieldGameEnded'], ['Field'], function(functionality) {
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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("Rabbit")){
                      rabbsOnField++;
                    }
                  }
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
    "PFUDOR": new Card("Jamie Bougher", ['living', 'Rainbow',' Useless'], ['Play'], function(functionality) {
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
    "Potato of fun": new Card("Michael Calarese", ['living', ' Useless','potato'], ['Field'], function(functionality) {
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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("potato")){
                      potatoInPlay++;
                    }
                  }
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
            users[this.parent].getCrd(6);
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
    "LUCK OF THE IRISH": new Card("Lachlan Murphy", ['living', 'Rainbow','FieldIncrementPointsAny'], ['Field'], function(functionality) {
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
              if (this.parent.cards != undefined){
                users[this.parent].getCrd(this.parent.cards.length);
              }
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
                users[findOpponent(this.parent)].removeCards(1,null);
                users[this.parent].cards.push(discardPile.pop())
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
    "STICKMAN UPGRADED": new Card("Jack Day", ['living','FieldStartTurn'], ['Field'], function(functionality) {
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
    "SUPERNOVA": new Card("Harry Trumble", ['uncounterable','FieldStartTurn'], ['Field'], function(functionality) {
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
            if (users[findOpponent(this.parent)].score < 0){
              users[findOpponent(this.parent)].score *= -1;
            }
            else if(users[findOpponent(this.parent)].score > 0){
              users[findOpponent(this.parent)].score *= -1;
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
    "TEA ATTACK": new Card("Will Taylor", ['living', 'blank white man','FieldGetCards'], ['FieldOp'], function(functionality) {
        switch(functionality) {
          case "getCards":
            if(users[this.parent].cards.length != undefined){
                var NewCards = users[this.parent].cards.length;
            }
            else{
                var NewCards = 1;
            }
            users[this.parent].decrementPoints(10*(NewCards-cardsInThisParentHand));
            if(users[this.parent].cards.length != undefined){
                cardsInThisParentHand = users[this.parent].cards.length;
            }
            else{
                cardsInThisParentHand = 1;
            }
          default:
            if(users[this.parent].cards.length != undefined){
                var cardsInThisParentHand = users[this.parent].cards.length;
            }
            else{
                var cardsInThisParentHand = 1;
            }

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
    "THE CASH COW": new Card("Josh Gilbert", ['living', 'cow','cardDestroyed'], ['Field'], function(functionality) {
        switch(functionality) {
          case "cardDestroyed":
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
            var playerCardLenth = 0;
            if(users[this.parent].cards.length == undefined){
                var playerCardLenth = 0;
              } 
            else{
                var playerCardLenth = users[this.parent].cards.length;
            }
            for (people in users){
              if(users[people].cards.length == undefined){
                var playerOpCardLenth = 0;
              } 
              else{
                var playerOpCardLenth = users[people].cards.length;
              }
              if (playerCardLenth < playerOpCardLenth){
                users[people].removeCards((playerOpCardLenth-playerCardLenth),null);
              }
              else if (playerCardLenth > playerOpCardLenth){
                users[people].getCrd((playerCardLenth-playerOpCardLenth),null);
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
              if (users[this.parent].cards != null){
                users[this.parent].removeCards(users[this.parent].cards.length - 1, null);
              }
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
    "TRIPLE BACON CHEESEBURGER": new Card("Mr Milton", ['cardDestroyed'], ['Field'], function(functionality) {
        switch(functionality) {
          case "cardDestroyed":
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
            for (crds in users[findOpponent(this.parent)].cards){
              users[this.parent].cards.push(crds);
            }
            users[findOpponent(this.parent)].cards = [];
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
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                    if (fieldCard.tags.includes("Rabbit")){
                      rabbsOnField++;
                    }
                  }
                }
              }
            }
            users[this.parent].incrementPoints(25+(25*rabbsOnField));
        }
      }),
    "UPGRADE IT": new Card("Lachie Jones", ['Rainbow','FieldStartTurn'], ['Field'], function(functionality) {
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
    "YSERA": new Card("Rishi Dhashinamoorthy", ['living', 'dragon', 'dragon boarder','FieldIncrementPoints'], ['Field'], function(functionality) {
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
            var potatoInPlay = 0;
            for (person in users){
              if(users[person].field != undefined){
                for (fieldCard in users[person].field){
                  if(fieldCard.tags != undefined){
                      if (fieldCard.tags.includes("potato")){
                      potatoInPlay++;
                      }
                  }
                }
              }
            }
            if (potatoInPlay != 0){
                users[this.parent].incrementPoints(50*(potatoInPlay+1));
            }
            else{
                users[this.parent].incrementPoints(50);
            }
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
        if (playerCounter==2){
            if (gameFinnished != "Yes"){
                if (gameRun != "running"){
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
                    console.error("game already running.");
                }
            }
            else{
                console.error("game has finnished");
            }
        }
    }
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        var str = decoder.write(data);
        if (str.substr(str.length-1, str.length) == '\n') {
            str = str.substr(0,str.length-1);
        }
        if (str.substr(0,6) == "#chat "){
            console.log("[CHAT]: " + str.substr(6,str.length));
            sendText(users["Player1"],`chat ${str.substr(6,str.length)}`);
            sendText(users["Player2"],`chat ${str.substr(6,str.length)}`);
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
                            console.error(`No card of name ${str.substr(2,str.length)} available! in ${users[findPlayer([sock.remoteAddress,sock.remotePort])].cards}`);
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
                sock.write("Game is not running \n");
            }
        }
        //passes player turn
        else if (str.substr(0,4) == 'pass'){
            if (gameRun == "running"|| gameRun == "ending"){
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
                sock.write("Game is not running"+"\n");
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