﻿using System;
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
            String strHostName = string.Empty;
            // Getting Ip address of local machine...
            // First get the host name of local machine.
            strHostName = Dns.GetHostName();
            Console.WriteLine("Local Machine's Host Name: " + strHostName);
            // Then using host name, get the IP address list..
            IPHostEntry ipEntry = Dns.GetHostEntry(strHostName);
            IPAddress[] addr = ipEntry.AddressList;

            IPlable.Content = $"IP Address {addr[1]}";
        }
    }
}
