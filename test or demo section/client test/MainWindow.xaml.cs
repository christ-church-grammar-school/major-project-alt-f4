using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Net.Sockets;
using System.Net;

namespace client_test
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        IPAddress ipAddr = new IPAddress(new byte[] { Convert.ToByte(10), Convert.ToByte(0), Convert.ToByte(0), Convert.ToByte(130) });
        IPEndPoint localEndPoint = new IPEndPoint(new IPAddress(new byte[] { Convert.ToByte(10), Convert.ToByte(0), Convert.ToByte(0), Convert.ToByte(130) }), 4000);

        Socket sender = new Socket(Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].AddressFamily, SocketType.Stream, ProtocolType.Tcp);

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Connect(object Sender, RoutedEventArgs rea)
        {
            Console.WriteLine(Dns.GetHostName());
            Console.WriteLine(ipAddr);
            Console.WriteLine(localEndPoint);
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

        private void send(object Sender, RoutedEventArgs rea)
        {
            try
            {
                byte[] messageSent = Encoding.ASCII.GetBytes(textToSend.Text);
                int byteSent = sender.Send(messageSent);

                byte[] messageRecieved = new byte[1024];

                int byteRecv = sender.Receive(messageRecieved);
                reply.Text = Encoding.ASCII.GetString(messageRecieved, 0, byteRecv);
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

        private void Disconnect(object Sender, RoutedEventArgs rea)
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

        private void lmao(object sender, RoutedEventArgs e)
        {
            Chatapp page = new Chatapp();
            var contentCopy = Content;
            Content = page;
            page.ladder += (object sender2, EventArgs e2) =>
            {
                Content = contentCopy;
            };
        }
    }
}
