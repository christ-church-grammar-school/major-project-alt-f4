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

namespace _1000_Blank_White_Cards
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Quit(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void joinGame(object sender, RoutedEventArgs e)
        {
            serverSelect page = new serverSelect();
            var contentCopy = Content;
            Content = page;
            page.ladder += (object sender2, EventArgs e2) =>
            {
                Content = contentCopy;
            };
        }

        private void Settings(object sender, RoutedEventArgs e)
        {
            SettingsPage page = new SettingsPage();
            var contentCopy = Content;
            Content = page;
            page.ladder += (object sender2, EventArgs e2) =>
            {
                Content = contentCopy;
            };
        }

        private void Host(object sender, RoutedEventArgs e)
        {
            ServerCreatePage page = new ServerCreatePage();
            var contentCopy = Content;
            Content = page;
            page.ladder += (object sender2, EventArgs e2) =>
            {
                Content = contentCopy;
            };
        }

        private void Achievements(object sender, RoutedEventArgs e)
        {

        }
    }
}
