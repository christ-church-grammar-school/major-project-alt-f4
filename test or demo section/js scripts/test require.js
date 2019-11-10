var msg = require('./test cardobjects.js');

console.log(msg);

/*Old cards Just in case*/
var deck1 =["ghost print","pot of gold print", "piggy power print","pig man print","more I want more print","happy bunny print","2012 print","spareChange print","reg neanderthal from the future print",'reg cat got the yarn print','rebel print','potato of fun print','pluto print','nessie print',"its christmas print",'emoji print','derpasaurus rex print','cookie print','chezburger print','Discard pele'];
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