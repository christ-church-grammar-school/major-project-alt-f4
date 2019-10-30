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
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;
using System.Windows.Threading;

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
        IPAddress ip;

        Socket sender = new Socket(Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].AddressFamily, SocketType.Stream, ProtocolType.Tcp);
        
        public GameUI()
        {
            InitializeComponent();
            Connect(127,0,0,1,4000);
        }

        private void Connect(int a, int b, int c, int d, int port)
        {
            IPEndPoint localEndPoint = new IPEndPoint(new IPAddress(new byte[] { Convert.ToByte(a), Convert.ToByte(b), Convert.ToByte(c), Convert.ToByte(d) }), port);
            Console.WriteLine(Dns.GetHostName());
            Console.WriteLine(ip);
            try
            {
                sender.Connect(localEndPoint);

                Console.WriteLine("Socket connected -> {0} ", sender.RemoteEndPoint.ToString());
            }
            catch (ArgumentNullException ane)
            {
                Console.WriteLine("ArgumentNullException : {0}", ane.ToString());
            }
            catch (SocketException se)
            {
                Console.WriteLine("SocketException : {0}", se.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine("Unexpected exception : {0}", e.ToString());
            }
        }

        private void send(string text)
        {
            try
            {
                byte[] messageSent = Encoding.ASCII.GetBytes(text);
                int byteSent = sender.Send(messageSent);

                byte[] messageRecieved = new byte[1024];

                int byteRecv = sender.Receive(messageRecieved);
                Console.WriteLine("hrrrrr" + Encoding.ASCII.GetString(messageRecieved, 0, byteRecv));
                handler(Encoding.ASCII.GetString(messageRecieved, 0, byteRecv));
            }
            catch (ArgumentNullException ane)
            {
                Console.WriteLine("ArgumentNullException : {0}", ane.ToString());
            }
            catch (SocketException se)
            {
                Console.WriteLine("SocketException : {0}", se.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine("Unexpected exception : {0}", e.ToString());
            }
        }
        
        private void handler(string reply)
        {
            Console.WriteLine(reply);
            if (reply.StartsWith("draw "))
            {
                summonHandCard(reply.Substring(5,reply.Length-5));
            } else if (reply.StartsWith("removeHand "))
            {
                Button button = new Button();
                for (var i = 0; i <hand.Count; i++)
                {
                    Image hrrr = (Image)hand[i].Content;
                    if (hrrr.Source == new BitmapImage(new Uri($"cards/{reply.Substring(11, reply.Length - 11)}.jpg", UriKind.Relative)) )
                    {
                        button = hand[i];
                    }
                }
                hand.Remove(button);
                GameUIGrid.Children.Remove(button);
                reorganiseHand();
            }
        }

        private void Disconnect()
        {
            try
            {
                sender.Shutdown(SocketShutdown.Both);
                sender.Close();
            }
            catch (ArgumentNullException ane)
            {
                Console.WriteLine("ArgumentNullException : {0}", ane.ToString());
            }
            catch (SocketException se)
            {
                Console.WriteLine("SocketException : {0}", se.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine("Unexpected exception : {0}", e.ToString());
            }
            sender = new Socket(Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].AddressFamily, SocketType.Stream, ProtocolType.Tcp);
        }

        private void playCard(object sender, RoutedEventArgs e)
        {
            Button button = (Button)sender;
            hand.Remove(button);
            GameUIGrid.Children.Remove(button);
            reorganiseHand();
            Image image = (Image)button.Content;
            discardPile.Source = image.Source;
        }

        private void pushButton(object sender, RoutedEventArgs e)
        {
            summonHandCard("3 headed guard dog2 print");
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
            if (field.Count > 9)
            {
                for (var x = 0; x < field.Count; x++)
                {
                    field[x].Margin = new Thickness(x * field[0].Width * 9 / field.Count + TextScroller.Width + 60 - field[x].Width, 270, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(field[x]));
                    GameUIGrid.Children.Add(field[x]);
                }
            }
            else
            {
                for (var x = 0; x < field.Count; x++)
                {
                    field[x].Margin = new Thickness((x - 1) * field[0].Width + TextScroller.Width + 60, 270, 0, 0);
                    GameUIGrid.Children.RemoveAt((int)GameUIGrid.Children.IndexOf(field[x]));
                    GameUIGrid.Children.Add(field[x]);
                }
            }
        }

        public void summonOponentHandCard(string card)
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
            reorganiseOponentHand();
        }

        private void reorganiseOponentHand()
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

        public void summonOponentFieldCard(string card)
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
            reorganiseOponentField();
        }

        private void reorganiseOponentField()
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

        private void bigg(object sender, RoutedEventArgs e)
        {
            Button card = (Button)sender;
            reorganiseHand();
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
        }

        public void ClimbLadder(object sender, RoutedEventArgs e)
        {
            Disconnect();
            ladder(this, EventArgs.Empty);
        }

        private void DrawCard_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            DrawCard.Margin = new Thickness(0, 50, 32, 0);
            DrawCard.Height += 10;
            DrawCard.Width += 8;
        }

        private void DrawCard_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            DrawCard.Margin = new Thickness(0, 55, 36, 0);
            DrawCard.Height -= 10;
            DrawCard.Width -= 8;
        }

        private void GimmeText(object sender, RoutedEventArgs e)
        {
            if (TypeText.Text != "")
            {
                TextBlock blockOfText = new TextBlock();
                blockOfText.Text = TypeText.Text;
                blockOfText.TextWrapping = TextWrapping.Wrap;
                blockOfText.FontSize = 6;

                stackTwoElectricBoogaloo.Children.Add(blockOfText);

                TextScroller.ScrollToBottom();

                TypeText.Text = "";
            }
        }

        private void textPush(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                if (TypeText.Text != "")
                {
                    TextBlock blockOfText = new TextBlock();
                    blockOfText.Text = TypeText.Text;
                    blockOfText.TextWrapping = TextWrapping.Wrap;
                    blockOfText.FontSize = 6;

                    stackTwoElectricBoogaloo.Children.Add(blockOfText);

                    TextScroller.ScrollToBottom();

                    TypeText.Text = "";
                }
            }
        }
    }
}