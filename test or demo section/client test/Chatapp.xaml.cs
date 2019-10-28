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
using System.Threading;
using System.Windows.Threading;

namespace client_test
{
    /// <summary>
    /// Interaction logic for Chatapp.xaml
    /// </summary>
    public partial class Chatapp : Page
    {
        // Declare member objects
        // Client for tcp, network stream to read bytes in socket
        TcpClient tcpClient = new TcpClient();
        NetworkStream serverStream = default(NetworkStream);
        string readData = string.Empty;
        string msg = "Connected to Chat Server ...";

        public EventHandler ladder;
        public Chatapp()
        {
            InitializeComponent();
        }

        private void Chatapp_Return(object sender, RoutedEventArgs e)
        {
            ladder(this, EventArgs.Empty);
        }


        // Purpose:     Connect to node.js application
        // End Result:  node.js app now has a socket open that can send
        //              messages back to this tcp client application
        private void cmdConnect_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(txtChatName.Text))
            {
                // tell them to put in an IP if they haven't
                txtConversation.Text += "Please input your IP.\n";
                return;
            }

            try
            {
                if (tcpClient.Connected == true)
                {
                    // create a new TCP client
                    TcpClient tcpClient = new TcpClient();
                    // connect it to your IP and port 4000
                    tcpClient.Connect(txtChatName.Text, 4000);
                    // get the stream from that TCP client
                    serverStream = tcpClient.GetStream();
                    AddPrompt();
                    // clear the server stream
                    serverStream.Flush();

                }
                else
                {                    
                    // connect it to your IP and port 4000
                    tcpClient.Connect(txtChatName.Text, 4000);
                    // get the stream from that TCP client
                    serverStream = tcpClient.GetStream();
                    AddPrompt();
                    // clear the server stream
                    serverStream.Flush();
                }
            }
            catch (Exception)
            {
                // error message in the chat
                this.txtConversation.Text += "Can't connect. Reason can be :\r\n1.Server is down.\r\n2.You lost internet connection\n";
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
                 this.txtConversation.Text += string.Format(
                          Environment.NewLine + Environment.NewLine +
                             ">> {0}", msg);
                 Thread.Sleep(10);

             }));
        }

        // Purpose:     Adds the " >> " prompt in the text box
        // End Result:  Shows prompt to user
        private void AddPrompt()
        {
            txtConversation.Text = txtConversation.Text +
                Environment.NewLine + msg;
        }

        // Purpose:     Send the text in typed by the user (stored in
        //              txtOutMsg)
        // End Result:  Sends text message to node.js (lamechat.js)
        private void cmdSendMessage_Click(object sender, RoutedEventArgs e)
        {

            if (tcpClient.Connected == true)
            {
                if (!string.IsNullOrEmpty(txtOutMsg.Text))
                {
                    byte[] outStream = Encoding.ASCII.GetBytes(txtOutMsg.Text);
                    serverStream.Write(outStream, 0, outStream.Length);
                    serverStream.Flush();
                }
            }

            else
            {
                this.txtConversation.Text += "You are not connected to a server. Please connect to one before sending a message.\n";
                return;
            }
            txtOutMsg.Text = String.Empty;

        }

        private void AutoScroll(object sender, TextChangedEventArgs e)
        {
            txtConversation.ScrollToEnd();
        }
    }
}
