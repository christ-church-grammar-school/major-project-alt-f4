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
using System.Net;

namespace _1000_Blank_White_Cards
{
    /// <summary>
    /// Interaction logic for ServerCreatePage.xaml
    /// </summary>
    public partial class ServerCreatePage : Page
    {
        public EventHandler ladder;

        public ServerCreatePage()
        {
            InitializeComponent();
        }

        public void ClimbLadder(object sender, RoutedEventArgs e)
        {
            ladder(this, EventArgs.Empty);
        }

        
        private void FindIP(object sender, RoutedEventArgs e)
        {
            string hostName = Dns.GetHostName(); // Retrive the Name of HOST  
            Console.WriteLine(hostName);
            // Get the IP  
            string myIP = Dns.GetHostEntry(hostName).AddressList[0].ToString();
            Console.WriteLine("My IP Address is :" + myIP);

            TextBlock IPinator = new TextBlock();
            IPinator.Text = myIP;
            IPinator.TextWrapping = TextWrapping.Wrap;
            IPinator.FontSize = 12;

            IPStack.Children.Add(IPinator);


            //Console.ReadKey();
        }
    }
}
