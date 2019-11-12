using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Windows.Input;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Media;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;
using System.Windows.Threading;
using System.Text.RegularExpressions;

namespace _1000_Blank_White_Cards
{
    /// <summary>
    /// Interaction logic for GameUI.xaml
    /// </summary>
    public partial class GameUI : Page
    {
        public EventHandler ladder;
        List<Button> hand = new List<Button>();
        List<Button> oponentsHand = new List<Button>();
        List<Button> field = new List<Button>();
        List<Button> oponentsField = new List<Button>();

        Dictionary<string,string> nameToFile = new Dictionary<string, string>();
        string ip;
        TcpClient tcpClient = new TcpClient();
        NetworkStream serverStream = default(NetworkStream);
        string readData = string.Empty;

        public GameUI()
        {
            InitializeComponent();
            // you're not gonna have a good time & yes this is the only way
            nameToFile[""] = "";
            nameToFile["3 HEADED GUARD DOG!"] = "3 headed guard dog2 print";
            nameToFile["2012"] = "2012 print";
            nameToFile["A HAPPY BEAR"] = "a happy bear print";
            nameToFile["A LOT OF HELP"] = "a lot of help print";
            nameToFile["ADD MONKEYS"] = "add monkeys print";
            nameToFile["ADDLEPUSS"] = "addlepuss print";
            nameToFile["ALEXSTRAZA"] = "alexstraza print";
            nameToFile["ANGRY RABBIT"] = "angry rabbit print";
            nameToFile["AROUND THE WORLD"] = "around the world print";
            nameToFile["ASSASSIN DUDE"] = "assassin dude print";
            nameToFile["ASSEMBLE! BART"] = "assemble bart print";
            nameToFile["ASSEMBLE! BLACK WIDOW"] = "assemble black widow print";
            nameToFile["ASSEMBLE! CAPTAIN AMERICA"] = "assemble cap print";
            nameToFile["ASSEMBLE! HAWKEYE"] = "assemble hawkeye print";
            nameToFile["ASSEMBLE! HOMER"] = "assemble homer print";
            nameToFile["ASSEMBLE! HULK"] = "assemble hulk print";
            nameToFile["ASSEMBLE! IRON MAN"] = "assemble iron man print";
            nameToFile["ASSEMBLE! LISA"] = "assemble lisa print";
            nameToFile["ASSEMBLE! MAGGIE"] = "assemble maggie print";
            nameToFile["ASSEMBLE! MARGE"] = "assemble marge print";
            nameToFile["ASSEMBLE THE SMALL CHILDREN"] = "assemble the small children print";
            nameToFile["ASSEMBLE! THOR"] = "assemble thor print";
            nameToFile["BACK TO THE FUTURE CARD"] = "back to the future card print";
            nameToFile["BAD NIGHTMARE"] = "bad nightmare print";
            nameToFile["BALLOON KNIGHT"] = "Balloon knight print";
            nameToFile["BALLOON SWORD"] = "balloon sword print";
            nameToFile["BANANA SHIELD"] = "banana shield print";
            nameToFile["BARBECUE SAUCE"] = "barbecue sauce print";
            nameToFile["DO A BARREL ROLL"] = "barrelroll print";
            nameToFile["BB8"] = "bb8 print";
            nameToFile["BESTOWED POWER!"] = "bestowed power print";
            nameToFile["BILLIONAIRE"] = "billionaire print";
            nameToFile["BLOCK IT ROCKET"] = "block it rocket print";
            nameToFile["BLOOD DEMON"] = "blood demon print";
            nameToFile["BOBASAURUS REX"] = "bobasaurus rex print";
            nameToFile["BRO FIGHT"] = "bro fight print";
            nameToFile["BUNGEE!"] = "bungee print";
            nameToFile["IT'S A BUTTER FLY!"] = "butter fly print";
            nameToFile["BUY BUY BUY"] = "buy buy buy print";
            nameToFile["CALM RABBIT"] = "calm rabbit print";
            nameToFile["CARMEN SANDIEGO"] = "carmen sandiego print";
            nameToFile["CARROT OF SURRENDER"] = "carrot of surrender print";
            nameToFile["CAT TRAIN"] = "cat train print";
            nameToFile["CATS"] = "cats print";
            nameToFile["CCGS BOY"] = "ccgs boy print";
            nameToFile["CENTRELINK"] = "centrelink print";
            nameToFile["CHEZBURGER"] = "chezburger print";
            nameToFile["CIVIL WAR"] = "civil war print";
            nameToFile["COFFEE BREAK"] = "coffee break print";
            nameToFile["COLOURFUL CARD"] = "colourful card print";
            nameToFile["COMPENSATION"] = "compensation print";
            nameToFile["COOKIE MONSTER"] = "cookie monster print";
            nameToFile["COOKIE"] = "cookie print";
            nameToFile["COOL DOWN"] = "cool down print";
            nameToFile["COOLEST CARD EVER"] = "coolest card ever print";
            nameToFile["COPY THE COPY CAT"] = "copy the copycat print";
            nameToFile["COPY CAT"] = "copycat print";
            nameToFile["COUCH GAG"] = "couch gag print";
            nameToFile["CRAZY RABBIT"] = "crazy rabbit print";
            nameToFile["CREEPER!"] = "creeper print";
            nameToFile["CUTE PENGUIN"] = "cute penguin print";
            nameToFile["DA REX"] = "da rex print";
            nameToFile["DAT CARD"] = "dat card print";
            nameToFile["DEATH BY UNICORN"] = "death by unicorn print";
            nameToFile["DEATH STAR"] = "death star print";
            nameToFile["DEATHWING"] = "deathwing print";
            nameToFile["DEEP FRIED CHICKEN"] = "deep fried chicken print";
            nameToFile["DEFENDER OF ARGUS"] = "defender of argus print";
            nameToFile["DERP"] = "derp print";
            nameToFile["DERPASAURUS REX"] = "derpasaurus rex print";
            nameToFile["DETECTIVE REX"] = "detective rex print";
            nameToFile["DEVIL'S PARTY"] = "devil's party print";
            nameToFile["Diamond sword"] = "Diamond sword print";
            nameToFile["Discard pele"] = "discard pele print";
            nameToFile["Donald trump"] = "donald trump print";
            nameToFile["Don't call me ishmael"] = "dont call me ishmael print";
            nameToFile["Don't recruit me"] = "dont recruit me print";
            nameToFile["Dora the explorer"] = "dora the explorer print";
            nameToFile["DOUBLE CARD USE"] = "double card use print";
            nameToFile["DR REX"] = "Dr rex print";
            nameToFile["DRAGON EGGS"] = "dragon eggs print";
            nameToFile["DRAGON NOT A REX"] = "Dragon not a rex print";
            nameToFile["DROSTE EFFECT"] = "droste effect print";
            nameToFile["DUMB RABBIT"] = "Dumb rabbit print";
            nameToFile["EDGAR"] = "Edgar print";
            nameToFile["EDWARD SNOWDEN"] = "edward snowden print";
            nameToFile["ELSA"] = "elsa print";
            nameToFile["EMOJI"] = "emoji print";
            nameToFile["EMP"] = "emp print";
            nameToFile["ERMAHGERD 50"] = "ermahgerd 50 points print";
            nameToFile["EVERYTHING IS AWESOME"] = "everything is awesome print";
            nameToFile["EXTINCTION"] = "extinction print";
            nameToFile["EYE OF SAURON"] = "Eye of Sauron print";
            nameToFile["FACE OFF"] = "face off print";
            nameToFile["FIELD ROBBER"] = "field robber print";
            nameToFile["FIND WEIRD RULES"] = "find weird rules print";
            nameToFile["FIRE BREATHING DUCK"] = "fire breathing duck print";
            nameToFile["FIREBALL"] = "fireball print";
            nameToFile["FLANDERS"] = "flanders print";
            nameToFile["FLYING COWS"] = "flying cows print";
            nameToFile["FRAGGLE PUSS"] = "fraggle puss print";
            nameToFile["FUTURE PREDATOR"] = "future predator print";
            nameToFile["FUZZY KNIGHT"] = "fuzzy knight print";
            nameToFile["GALACTUS BARFER OF CARDS"] = "galactus barfer of cards print";
            nameToFile["GALACTUS DEVOURER OF CARDS"] = "galactus devourer of cards print";
            nameToFile["GAME CHANGER"] = "Game changer print";
            nameToFile["GHOST"] = "ghost print";
            nameToFile["GLORIOUS BOUNTY"] = "glorious bounty print";
            nameToFile["GO TO JAIL"] = "go to jail print";
            nameToFile["GOAL AFTER SIREN"] = "goal after siren print";
            nameToFile["GOD BLESS AMERICA"] = "god bless america print";
            nameToFile["GOLF"] = "golf print";
            nameToFile["GRANNY"] = "granny";
            nameToFile["GRASS WARLOCK"] = "grass warlock print";
            nameToFile["GREAT PURGE"] = "great purge print";
            nameToFile["GREEN ARROW"] = "green arrow print";
            nameToFile["GUARDIAN ANGEL"] = "guardian angel print";
            nameToFile["HA TAKE THAT"] = "ha take that print";
            nameToFile["HACKER"] = "hacker print";
            nameToFile["HAPPY BUNNY"] = "happy bunny print";
            nameToFile["HAPPY SNOWMAN"] = "happy snowman print";
            nameToFile["HATS"] = "hats print";
            nameToFile["HCG"] = "hcg print";
            nameToFile["HE SLIMED ME"] = "he slimed me print";
            nameToFile["HELPFUL MARSHMALLOW"] = "helpful marshmallow print";
            nameToFile["HELPFUL SWEET"] = "helpful sweet print";
            nameToFile["HELPING DA REXES"] = "helping da rexes print";
            nameToFile["HIDDEN TREASURES"] = "hidden treasures print";
            nameToFile["HILLARY CLINTON"] = "hillary clinton print";
            nameToFile["HOLEY CARD"] = "holey card print";
            nameToFile["HONEY BADGER"] = "honey badger print";
            nameToFile["I TAKE FROM YOU YOUR POWER"] = "I take from you your power print";
            nameToFile["IN SOVIET RUSSIA"] = "in soviet russia print";
            nameToFile["INFINITE SHELDON"] = "infinite sheldon print";
            nameToFile["INSPECTOR REX"] = "inspector rex print";
            nameToFile["INTERNET SEARCH"] = "internet search print";
            nameToFile["INTERRUPTING COW"] = "interrupting cow print";
            nameToFile["INTERVENTION"] = "intervention print";
            nameToFile["IT'S A TRAP"] = "its a trap print";
            nameToFile["IT'S CHRISMAS"] = "its christmas print";
            nameToFile["IT'S OVER 9000"] = "its over 9000 print";
            nameToFile["JESASE"] = "jesase print";
            nameToFile["JOKER'S CHOICE"] = "joker's choice print";
            nameToFile["JOOR WELCOME"] = "joor welcome print";
            nameToFile["JUST DO IT"] = "just do it print";
            nameToFile["KIDNAP THE COOKIE MONSTER"] = "kidnap the cookie monster print";
            nameToFile["KILLER BEAR"] = "killer bear print";
            nameToFile["KING OF THE TRASH"] = "king of the trash print";
            nameToFile["KINGPIN"] = "kingpin print";
            nameToFile["KITTY SAMURAI"] = "kitty samurai print";
            nameToFile["KOALAGEDDON"] = "koalageddon print";
            nameToFile["KYLO RENS LIGHTSABER"] = "kylo rens lightsaber print";
            nameToFile["LEAGUE OF NINJAS"] = "League of Ninjas web";
            nameToFile["LEGO BUILD"] = "lego build print";
            nameToFile["LET THERE BE REX"] = "let there be rex print";
            nameToFile["LEVEL THE PLAYING FIELD"] = "level the playing field print";
            nameToFile["LIGHT VS DARK"] = "light vs dark print";
            nameToFile["LIZARD PEOPLE"] = "lizard people print";
            nameToFile["LLAMA BATH"] = "llama bath print";
            nameToFile["LLAMASAURUS"] = "llamasaurus rex print";
            nameToFile["LORD JARAXXUS"] = "lord jaraxxus print";
            nameToFile["LUCKY DAY"] = "lucky day print";
            nameToFile["LUCKY TROLL"] = "lucky troll print";
            nameToFile["MAD DAD"] = "mad dad print";
            nameToFile["MAGICAL CHICKEN"] = "magical chicken print";
            nameToFile["MAGICAL CHOOK WIRE"] = "magical chook wire print";
            nameToFile["MALYGOS"] = "malygos print";
            nameToFile["MAN CHICKEN"] = "man chicken print";
            nameToFile["MAN WITH SWORDS"] = "man with swords print";
            nameToFile["MARIO POWER"] = "mario power print";
            nameToFile["MARSHMELLOW MONSTER"] = "marshmallow monster print";
            nameToFile["MAXIMUM FAILURE"] = "maximum failure print";
            nameToFile["MECHA BEAR"] = "mecha bear print";
            nameToFile["MICHAEL JORDAN CARD!"] = "michael jordan card print";
            nameToFile["MINE TURTLE"] = "mine turtle print";
            nameToFile["MIRRORMAN"] = "mirrorman print";
            nameToFile["MONSTER ASSASIN"] = "monster assassin print";
            nameToFile["MORE I WANT MORE"] = "more I want more print";
            nameToFile["MOST USELESS CARD EVER"] = "most useless card ever print";
            nameToFile["MR MONSTER"] = "mr monster print";
            nameToFile["MUD SLIDE"] = "mud slide print";
            nameToFile["MURICA"] = "murica print";
            nameToFile["MUSICAL CHAIRS"] = "musical chairs print";
            nameToFile["MUSTARD"] = "mustard print";
            nameToFile["NARWHALS ARE BADASS"] = "narwhals are badass";
            nameToFile["NECROMANCER"] = "necromancer print";
            nameToFile["NEIL DE GRASSE TYSON"] = "neil de grasse tyson print";
            nameToFile["NESSIE"] = "nessie print";
            nameToFile["NINJA"] = "ninja";
            nameToFile["NON-BELIEVER"] = "non-believer print";
            nameToFile["NORTH POLE"] = "north pole print";
            nameToFile["O'BE ONE"] = "obe one print";
            nameToFile["OLD MAN SCIENTIST"] = "old man scientist print";
            nameToFile["OMEGA SHIELD"] = "omega shield print";
            nameToFile["ONYXIA"] = "onyxia print";
            nameToFile["OPPOSITE DAY"] = "opposite day print";
            nameToFile["PARTY RABBIT"] = "party rabbit print";
            nameToFile["PAUSE REWIND"] = "pause rewind print";
            nameToFile["PEEPING TOM"] = "peeping tom print";
            nameToFile["PEEPO PIG"] = "peepo pig print";
            nameToFile["PFUDOR"] = "pfudor print";
            nameToFile["PIG MAN"] = "pig man print";
            nameToFile["PIGGY POWER"] = "piggy power print";
            nameToFile["PINAPPLE POWER"] = "pineapple power print";
            nameToFile["PLANTASAURUS"] = "plantasaurus print";
            nameToFile["PLAYER ONE"] = "player one print";
            nameToFile["PLOT TWIST"] = "plot twist print";
            nameToFile["PLUTO"] = "pluto print";
            nameToFile["PORTAL"] = "portal pribt";
            nameToFile["Pot of gold"] = "pot of gold print";
            nameToFile["Potato of fun"] = "potato of fun print";
            nameToFile["Pow"] = "pow print";
            nameToFile["Power to the max"] = "power to the max print";
            nameToFile["Pringle man"] = "pringle man print";
            nameToFile["Professor mcgonagall"] = "professor mcgonagall print";
            nameToFile["Pugasaurus Rex"] = "Pugasaurus Rex print";
            nameToFile["Purple man"] = "purple man print";
            nameToFile["Raging bull"] = "raging bull print";
            nameToFile["RAINBOWOSAURUS"] = "rainbowosaurusl print";
            nameToFile["RAPTOR HANDS"] = "raptor hands print";
            nameToFile["REBEL"] = "rebel print";
            nameToFile["RECRUIT! NICK FURY"] = "recruit nick fury print";
            nameToFile["REFILL YOUR MIGHTY HAND"] = "refill your mighty hand print";
            nameToFile["ABSORB"] = "reg absorb";
            nameToFile["ACID RAIN"] = "reg acid rain print";
            nameToFile["ASSORTED ANGRY TOWNSPEOPLE"] = "reg assorted angry townspeople print";
            nameToFile["AUSSIE AUSSIE AUSSIE"] = "reg aussie aussie aussie print";
            nameToFile["BO BO BO BO BO BO BO"] = "reg bo bo bo bo bo bo print";
            nameToFile["CAN'T GET THE BUCHER BACK"] = "reg can't get the butcher back print";
            nameToFile["CAT GOT THE YARN"] = "reg cat got the yarn print";
            nameToFile["CHICKEN ON A RAFT"] = "reg chicken on a raft print";
            nameToFile["CHILDHOOD RUINED"] = "reg childhood ruined print";
            nameToFile["COWBOY CAT WITH GOLDEN GUNS RIDING A UNICORN"] = "reg cowboy cat with golden guns riding a unicorn print";
            nameToFile["COWS"] = "reg cows print";
            nameToFile["DARK DC"] = "reg dark dc print";
            nameToFile["EAT THE RICH"] = "reg eat the rich print";
            nameToFile["EWOKS EAT PEOPLE"] = "reg ewoks eat people";
            nameToFile["EXTERMINATE"] = "reg exterminate";
            nameToFile["FALCREM"] = "reg falcrem print";
            nameToFile["HELLO THERE"] = "reg hello there print";
            nameToFile["INCONSPICUOUS DISGUISE"] = "reg inconspicuous disguise print";
            nameToFile["INDEPENDENCE DAY"] = "reg Independence ay print";
            nameToFile["IT'S RAINING MEN"] = "reg its raining men print";
            nameToFile["JOHN WICK"] = "reg john wick print";
            nameToFile["LLAMAS WITH HATS"] = "reg llamas with hats";
            nameToFile["LUCK OF THE IRISH"] = "reg luck of the irish print'";
            nameToFile["MINE MINE MINE"] = "reg mine mine mine print";
            nameToFile["Get Down MR PRESIDENT"] = "reg mr president print";
            nameToFile["NEADERTHAL FROM THE FUTURE"] = "reg neanderthal from the future print";
            nameToFile["PACIFISM"] = "reg pacifism print";
            nameToFile["POT OF GREED"] = "reg pot of gold print";
            nameToFile["SACRIFICIAL LAMB"] = "reg sacrificial lamb print";
            nameToFile["SAMARA"] = "reg samara print";
            nameToFile["SAMSUNG GALAXY S7"] = "reg samsung galaxy s7 print";
            nameToFile["SILURIAN"] = "Reg silurian print";
            nameToFile["SPIDER HAM"] = "reg spider ham print";
            nameToFile["SQUID GUN"] = "reg squid gun print";
            nameToFile["STOP BE HUMBLE"] = "reg stop be humble print";
            nameToFile["SWIPER NO SWIPING"] = "reg swiper no swiping print";
            nameToFile["TEAM DEATH MATCH"] = "reg team death match print";
            nameToFile["TIME LORD SCIENCE"] = "reg time lord science print";
            nameToFile["TOILET HUMOUR"] = "reg toilet humour print";
            nameToFile["UNDERWEAR SPIDER-GUY"] = "reg underwear spider-guy print";
            nameToFile["UPSIDE DOWN"] = "reg upside print";
            nameToFile["YOU TRICKED A POLAR BEAR"] = "reg you tricked a polar bear print";
            nameToFile["ZYGON"] = "reg zygon print";
            nameToFile["RESET"] = "reset print";
            nameToFile["RESURREX"] = "resurrex print";
            nameToFile["REVERSE HOLLOWING"] = "reverse hollowing print";
            nameToFile["REVERSE"] = "reverse print";
            nameToFile["REX WILL RULE"] = "rex will rule print";
            nameToFile["RICHIE RICH"] = "richie rich print";
            nameToFile["ROBIN HOOD"] = "robin hood print";
            nameToFile["ROBO SHREK"] = "robo shrek print";
            nameToFile["SACRIFICIAL PACT"] = "sacrificial pact print";
            nameToFile["SCORORER MISTAKE"] = "scorer mistake print";
            nameToFile["SCROOGE MCDUCK"] = "scrooge mcduck print";
            nameToFile["SECRET AGENT"] = "secret agent print";
            nameToFile["SHREK REKT"] = "shrek rekt print";
            nameToFile["SKELATOR"] = "skelator print";
            nameToFile["SKY DIVE"] = "sky dive print";
            nameToFile["SLAUGHTERHOUSE"] = "slaughterhouse print";
            nameToFile["SLEEP PARALYSIS"] = "sleep paralysis print";
            nameToFile["SLENDERMAN"] = "slenderman print";
            nameToFile["SLIME"] = "slime print";
            nameToFile["SMALL CHILD"] = "small child print";
            nameToFile["SMEXY REX"] = "smexy rex print";
            nameToFile["SNAGGLEPUSS"] = "snagglepuss print";
            nameToFile["SNOWMAN FORCEFIELD"] = "snowman forcefield print";
            nameToFile["SOCIALDARWINSISM"] = "socialdarwinism print";
            nameToFile["SONIC SPEED"] = "sonic speed print";
            nameToFile["SPACE JAMS"] = "space jams print";
            nameToFile["SPARE CHANGE"] = "spare change print";
            nameToFile["SPEED UP THE PACE"] = "speed up the pace print";
            nameToFile["STICKMAN UPGRADED"] = "stickman upgraded print";
            nameToFile["STATEGIC ADVANTAGE"] = "strategic advantage print";
            nameToFile["STRAWMAN"] = "strawman print";
            nameToFile["SUN COMES OUT"] = "sun comes out print";
            nameToFile["SUPERNOVA"] = "supernova print";
            nameToFile["SUSPICIOUS MONKEY"] = "suspicious monkey print";
            nameToFile["SWIFTY NINJAS"] = "swifty ninjas print";
            nameToFile["SWITCHEROO"] = "switcheroo print";
            nameToFile["TAGGLEPUSS"] = "tagglepuss print";
            nameToFile["TDOGGYREX"] = "tdoggyrex print";
            nameToFile["TEA ATTACK"] = "tea attack print";
            nameToFile["TEAM UP"] = "team up print";
            nameToFile["TERRIAN FALCON"] = "terrian falcon print";
            nameToFile["THA COOL CARD"] = "tha cool card print";
            nameToFile["THE ALMIGHTY BLORB"] = "the almighty bloorb print";
            nameToFile["THE BIG BAD BOSS WOLF"] = "the big bad boss wolf print";
            nameToFile["THE CASH COW"] = "the cash cow print";
            nameToFile["THE COLLECTOR"] = "the collector print";
            nameToFile["THE EQUILISER"] = "the equaliser print";
            nameToFile["THE FACE"] = "the face print";
            nameToFile["THE GREAT DIVIDE"] = "the great divide print";
            nameToFile["THE NUKE"] = "the nuke print";
            nameToFile["THE RING OF POWER"] = "the ring of power print";
            nameToFile["THE SHEEP EXPLODES THEREFORE THE COW EXPLODES"] = "the sheep explodes therefore the cow explodes print";
            nameToFile["THE STUPID IT BURNS"] = "the stupid it burns print";
            nameToFile["THE WHISTLER"] = "the whistler print";
            nameToFile["THERE CAN ONLY BE ONE COUNTER"] = "there can be only one counter print";
            nameToFile["THERE CAN BE ONLY ONE"] = "there can be only one print";
            nameToFile["THEY'RE TAKING THE HOBBITS TO ISENGARD"] = "they're taking the hobbits to isengard print";
            nameToFile["THIEF CITY"] = "thief city print";
            nameToFile["THREE MUSKETEERS"] = "three musketeers print";
            nameToFile["TIME LIMIT"] = "time limit print";
            nameToFile["TOMATO SAUCE"] = "tomato sauce print";
            nameToFile["TOO MANY MUPPETS"] = "too many muppets print";
            nameToFile["TOXIN SPIDER"] = "toxin spider print";
            nameToFile["TRIPLE BACON CHEESEBURGER"] = "triple bacon cheeseburger print";
            nameToFile["TROLL"] = "troll print";
            nameToFile["TROLL REX"] = "troll rex print";
            nameToFile["TRUMP STEAKS"] = "trump steaks print";
            nameToFile["TURKEY"] = "turkey print";
            nameToFile["TURTLE BUNNY"] = "turtle bunny print";
            nameToFile["ULTIMATE CARDORNATOR"] = "ultimate cardornator print";
            nameToFile["ULTIMMATE PIKA"] = "ultimate pika print";
            nameToFile["ULTIMATE SWAG"] = "ultimateswag print";
            nameToFile["ULTRA KEY"] = "ultra key print";
            nameToFile["UNHAPPY SNOWMAN"] = "unhappy snowman print";
            nameToFile["UNICORN RABBIT"] = "unicorn rabbit print";
            nameToFile["UPGRADE IT"] = "upgrade it print";
            nameToFile["VAMPIRE BAT"] = "vampire bat print";
            nameToFile["WAAAHMBULANCE"] = "waaahmbulance print";
            nameToFile["WASP"] = "wasp print";
            nameToFile["WHY BURN THEM"] = "why burn them print";
            nameToFile["WHY WOULD YOU TRAIN A DRAGON"] = "why would you train a dragon print";
            nameToFile["WIN WIN"] = "win win print";
            nameToFile["WINTER IS COMING"] = "winter is coming print";
            nameToFile["X-WING"] = "x-wing print";
            nameToFile["YEAR 12 EXAM"] = "year 12 exam print";
            nameToFile["YOU SUNK MY BATTLESHIP"] = "you sunk my battleship print";
            nameToFile["YOUR FAVORITE TOY"] = "your favourite toy print";
            nameToFile["YSERA"] = "ysera print";
            nameToFile["ZEUS POTATO"] = "zeus potato print";
            nameToFile["ZEUS"] = "zeus print";
            nameToFile["ZOMBIE APOCALYPSE"] = "zombie apocalypse print";
        }

        private void cmdConnect_Click()
        {
            try
            {
                Console.WriteLine(((MainWindow)Window.GetWindow(this)).IPToJoin);
                ip = ((MainWindow)Window.GetWindow(this)).IPToJoin;
                if (tcpClient.Connected == true)
                {
                    // create a new TCP client
                    TcpClient tcpClient = new TcpClient();
                    // connect it to your ip and port 4000
                    tcpClient.Connect(ip, 4000);
                    // get the stream from that TCP client
                    serverStream = tcpClient.GetStream();
                    // clear the server stream
                    serverStream.Flush();

                }
                else
                {
                    // connect it to your ip and port 4000
                    tcpClient.Connect(ip, 4000);
                    // get the stream from that TCP client
                    serverStream = tcpClient.GetStream();
                    // clear the server stream
                    serverStream.Flush();
                }
            }
            catch (Exception e)
            {
                // error
                Console.WriteLine("lmao it errored");
                Console.WriteLine(e.ToString());
                return;
            }
            // open a new task
            Task taskOpenEndpoint = Task.Factory.StartNew(() =>
            {
                while (true)
                {
                    // Read bytes
                    serverStream = tcpClient.GetStream();
                    byte[] message = new byte[4096];
                    int bytesRead;
                    bytesRead = 0;

                    try
                    {
                        // Read up to 4096 bytes
                        bytesRead = serverStream.Read(message, 0, 4096);
                    }
                    catch
                    {
                        // a socket error has occurred
                    }

                    // we have read the message.
                    ASCIIEncoding encoder = new ASCIIEncoding();
                    // Update main window
                    AddMessage(encoder.GetString(message, 0, bytesRead));
                    // wait half a second to update again to reduce lag
                    Thread.Sleep(500);
                }
            });
        }

        // Purpose:     Updates the window with the newest message received
        // End Result:  Will display the message received to this tcp based client
        private void AddMessage(string msg)
        {
            Dispatcher.BeginInvoke(DispatcherPriority.Input, (ThreadStart)(
             () =>
             {
                 handler(msg);
                 Thread.Sleep(10);

             }));
        }

        // Purpose:     Send the text in typed by the user (stored in
        //              txtOutMsg)
        // End Result:  Sends text message to node.js (lamechat.js)
        private void cmdSendMessage_Click(string msg)
        {

            if (tcpClient.Connected == true)
            {
                if (!string.IsNullOrEmpty(msg))
                {
                    byte[] outStream = Encoding.ASCII.GetBytes(msg);
                    serverStream.Write(outStream, 0, outStream.Length);
                    serverStream.Flush();
                }
            }

            else
            {
                this.TypeText.Text += "You are not connected to a server. Please connect to one before sending a message.\n";
                return;
            }
            TypeText.Text = String.Empty;

        }

        private void lmao(string chat)
        {
            TextBlock blockOfText = new TextBlock();
            blockOfText.Text = TypeText.Text;
            blockOfText.TextWrapping = TextWrapping.Wrap;
            blockOfText.FontSize = 6;

            stackTwoElectricBoogaloo.Children.Add(blockOfText);

            TextScroller.ScrollToBottom();

            TypeText.Text = "";
        }

        private void handler(string reply)
        {
            try
            {
                if (reply.Contains("\n"))
                {
                    string[] array = reply.Split('\n');
                    for (int i = 0; i < array.Length; i++)
                    {
                        string x = (string)array[i];
                        handler(x);
                    }
                    return;
                }
                Console.WriteLine("Sent: \"" + reply + '"');
                if (reply.StartsWith("chat "))
                {
                    lmao(reply.Substring(5, reply.Length));
                }
                else if (reply.StartsWith("sc "))
                {
                    string[] x = reply.Substring(3, reply.Length).Split(' ');
                    scoreBox.Text = $"Score:\nYou: {x[0]}\nPlayer 2: {x[1]}";
                }
                else if (reply.StartsWith("uc "))
                {
                    try
                    {
                        foreach (Button card in hand)
                        {
                            GameUIGrid.Children.Remove(card);
                            hand.Remove(card);
                            Console.WriteLine("yep hand");
                        }
                    }
                    catch
                    {
                        Console.WriteLine("it didn't work hand");
                    }
                    try
                    {
                        foreach (Button card in field)
                        {
                            GameUIGrid.Children.Remove(card);
                            field.Remove(card);
                            Console.WriteLine("yep field");
                        }
                    }
                    catch
                    {
                        Console.WriteLine("it didn't work field");
                    }
                    try
                    {
                        foreach (Button card in oponentsHand)
                        {
                            GameUIGrid.Children.Remove(card);
                            oponentsHand.Remove(card);
                            Console.WriteLine("yep oponent's hand");
                        }
                    }
                    catch
                    {
                        Console.WriteLine("it didn't work oponent's hand");
                    }
                    try
                    {
                        foreach (Button card in oponentsField)
                        {
                            GameUIGrid.Children.Remove(card);
                            oponentsField.Remove(card);
                            Console.WriteLine("yep oponent's field");
                        }
                    }
                    catch
                    {
                        Console.WriteLine("it didn't work oponent's field");
                    }
                    string[] x = reply.Substring(3, reply.Length - 3).Split('|');
                    foreach (String card in x[0].Split(','))
                    {
                        Console.WriteLine(card + '"' + x.Length.ToString() + '"');
                        summonHandCard(nameToFile[card]);
                    }
                    foreach (String card in x[1].Split(','))
                    {
                        Console.WriteLine(card + '"' + x.Length.ToString() + '"');
                        summonFieldCard(nameToFile[card]);
                    }
                    foreach (String card in x[2].Split(','))
                    {
                        Console.WriteLine(card + '"' + x.Length.ToString() + '"');
                        summonOponentFieldCard(nameToFile[card]);
                    }
                    for (int i = 0; i < Convert.ToInt32(x[3]); i++)
                    {
                        summonOponentHandCard("cardback print");
                    }
                    discardPile.Source = new BitmapImage(new Uri($"cards/{x[4]}.jpg", UriKind.Relative));
                }
                
            }
            catch
            {
                Console.WriteLine("stack overflow");
            }
        }

        private void playCard(object sender, RoutedEventArgs e)
        {
            Button button = (Button)sender;
            String x = ((Image)button.Content).Source.ToString();
            String y = x.Substring(62, x.Length - 66);
            String z = nameToFile.FirstOrDefault(c => c.Value == y).Key;
            Console.WriteLine("\"{0}\"\"{1}\"", z, y);
            cmdSendMessage_Click("p "+z);
        }

        private void pushButton(object sender, RoutedEventArgs e)
        {
            summonHandCard("3 headed guard dog2 print");
            summonFieldCard("3 headed guard dog2 print");
            summonOponentHandCard("3 headed guard dog2 print");
            summonOponentFieldCard("3 headed guard dog2 print");
            Console.WriteLine(((MainWindow)Window.GetWindow(this)).IPToJoin);
        }

        public void summonHandCard(string card)
        {
            hand.Add(new Button());
            Image image = new Image();
            image.Source = new BitmapImage(new Uri($"cards/{card}.jpg", UriKind.Relative));
            hand[hand.Count - 1].Content = image;
            GameUIGrid.Children.Add(hand[hand.Count - 1]);
            hand[hand.Count - 1].Click += playCard;
            hand[hand.Count - 1].Height = 77;
            hand[hand.Count - 1].Width = 59;
            hand[hand.Count - 1].VerticalAlignment = VerticalAlignment.Bottom;
            hand[hand.Count - 1].HorizontalAlignment = HorizontalAlignment.Left;
            hand[hand.Count - 1].MouseEnter += bigg;
            hand[hand.Count - 1].MouseLeave += smol;
            reorganiseHand();
        }

        private void reorganiseHand()
        {
            if (hand.Count > 9)
            {
                for (var x = 0; x < hand.Count; x++)
                {
                    hand[x].Margin = new Thickness(x * hand[0].Width * 9 / hand.Count + TextScroller.Width + 60 - hand[x].Width, 270, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(hand[x]));
                    GameUIGrid.Children.Add(hand[x]);
                }
            }
            else
            {
                for (var x = 0; x < hand.Count; x++)
                {
                    hand[x].Margin = new Thickness((x - 1) * hand[0].Width + TextScroller.Width + 60, 270, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(hand[x]));
                    GameUIGrid.Children.Add(hand[x]);
                }
            }
        }

        public void summonFieldCard(string card)
        {
            field.Add(new Button());
            Image image = new Image();
            image.Source = new BitmapImage(new Uri($"cards/{card}.jpg", UriKind.Relative));
            field[field.Count - 1].Content = image;
            GameUIGrid.Children.Add(field[field.Count - 1]);
            field[field.Count - 1].Click += playCard;
            field[field.Count - 1].Height = 65;
            field[field.Count - 1].Width = 48;
            field[field.Count - 1].VerticalAlignment = VerticalAlignment.Bottom;
            field[field.Count - 1].HorizontalAlignment = HorizontalAlignment.Left;
            field[field.Count - 1].MouseEnter += bigg;
            field[field.Count - 1].MouseLeave += smol;
            reorganiseField();
        }

        private void reorganiseField()
        {
            if (field.Count > 11)
            {
                for (var x = 0; x < field.Count; x++)
                {
                    field[x].Margin = new Thickness(x * field[0].Width * 11 / field.Count + TextScroller.Width + 60 - field[x].Width, 0, 0, 80);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(field[x]));
                    GameUIGrid.Children.Add(field[x]);
                }
            }
            else
            {
                for (var x = 0; x < field.Count; x++)
                {
                    field[x].Margin = new Thickness((x - 1) * field[0].Width + TextScroller.Width + 60, 0, 0, 80);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(field[x]));
                    GameUIGrid.Children.Add(field[x]);
                }
            }
        }

        public void summonOponentHandCard(string card)
        {
            oponentsHand.Add(new Button());
            Image image = new Image();
            image.Source = new BitmapImage(new Uri($"cards/{card}.jpg", UriKind.Relative));
            oponentsHand[oponentsHand.Count - 1].Content = image;
            GameUIGrid.Children.Add(oponentsHand[oponentsHand.Count - 1]);
            oponentsHand[oponentsHand.Count - 1].Click += playCard;
            oponentsHand[oponentsHand.Count - 1].Height = 77;
            oponentsHand[oponentsHand.Count - 1].Width = 59;
            oponentsHand[oponentsHand.Count - 1].VerticalAlignment = VerticalAlignment.Top;
            oponentsHand[oponentsHand.Count - 1].HorizontalAlignment = HorizontalAlignment.Left;
            oponentsHand[oponentsHand.Count - 1].MouseEnter += bigg;
            oponentsHand[oponentsHand.Count - 1].MouseLeave += smol;
            reorganiseOponentHand();
        }

        private void reorganiseOponentHand()
        {
            if (oponentsHand.Count > 9)
            {
                for (var x = 0; x < oponentsHand.Count; x++)
                {
                    oponentsHand[x].Margin = new Thickness(x * oponentsHand[0].Width * 9 / oponentsHand.Count + TextScroller.Width + 60 - oponentsHand[x].Width, 0, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(oponentsHand[x]));
                    GameUIGrid.Children.Add(oponentsHand[x]);
                }
            }
            else
            {
                for (var x = 0; x < oponentsHand.Count; x++)
                {
                    oponentsHand[x].Margin = new Thickness((x - 1) * oponentsHand[0].Width + TextScroller.Width + 60, 0, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(oponentsHand[x]));
                    GameUIGrid.Children.Add(oponentsHand[x]);
                }
            }
        }

        public void summonOponentFieldCard(string card)
        {
            oponentsField.Add(new Button());
            Image image = new Image();
            image.Source = new BitmapImage(new Uri($"cards/{card}.jpg", UriKind.Relative));
            oponentsField[oponentsField.Count - 1].Content = image;
            GameUIGrid.Children.Add(oponentsField[oponentsField.Count - 1]);
            oponentsField[oponentsField.Count - 1].Click += playCard;
            oponentsField[oponentsField.Count - 1].Height = 65;
            oponentsField[oponentsField.Count - 1].Width = 48;
            oponentsField[oponentsField.Count - 1].VerticalAlignment = VerticalAlignment.Top;
            oponentsField[oponentsField.Count - 1].HorizontalAlignment = HorizontalAlignment.Left;
            oponentsField[oponentsField.Count - 1].MouseEnter += bigg;
            oponentsField[oponentsField.Count - 1].MouseLeave += smol;
            reorganiseOponentField();
        }

        private void reorganiseOponentField()
        {
            if (oponentsField.Count > 11)
            {
                for (var x = 0; x < oponentsField.Count; x++)
                {
                    oponentsField[x].Margin = new Thickness(x * oponentsField[0].Width * 11 / oponentsField.Count + TextScroller.Width + 60 - oponentsField[x].Width, 80, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(oponentsField[x]));
                    GameUIGrid.Children.Add(oponentsField[x]);
                }
            }
            else
            {
                for (var x = 0; x < oponentsField.Count; x++)
                {
                    oponentsField[x].Margin = new Thickness((x - 1) * oponentsField[0].Width + TextScroller.Width + 60, 80, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(oponentsField[x]));
                    GameUIGrid.Children.Add(oponentsField[x]);
                }
            }
        }

        private void bigg(object sender, RoutedEventArgs e)
        {
            Button card = (Button)sender;
            reorganiseHand();
            reorganiseField();
            reorganiseOponentHand();
            reorganiseOponentField();
            //card.Margin = new Thickness(card.Margin.Left - 10, card.Margin.Top - 15, 0, 0);
            card.Height += 60;
            card.Width += 40;
            GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(card));
            GameUIGrid.Children.Add(card);
        }

        private void smol(object sender, RoutedEventArgs e)
        {
            Button card = (Button)sender;
            //card.Margin = new Thickness(card.Margin.Left + 10, card.Margin.Top + 15, 0, 0);
            card.Height -= 60;
            card.Width -= 40;
            reorganiseHand();
            reorganiseField();
            reorganiseOponentHand();
            reorganiseOponentField();
        }

        public void ClimbLadder(object sender, RoutedEventArgs e)
        {
            ladder(this, EventArgs.Empty);
        }

        private void DrawCard_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            DrawCard.Margin = new Thickness(60, -4, 0, 0);
            DrawCard.Height += 10;
            DrawCard.Width += 8;
        }

        private void DrawCard_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            DrawCard.Margin = new Thickness(65, 0, 0, 0);
            DrawCard.Height -= 10;
            DrawCard.Width -= 8;
        }

        private void textPush(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                if (TypeText.Text != "")
                {
                    cmdSendMessage_Click("#chat " + TypeText.Text);
                }
            }
        }

        private void connect(object sender, RoutedEventArgs e)
        {
            cmdConnect_Click();
        }
    }
}