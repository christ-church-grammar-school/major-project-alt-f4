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
    /// Interaction logic for avatarpage.xaml
    /// </summary>
    public partial class avatarpage : Page
    {
        public EventHandler ladder;

        public avatarpage()
        {
            InitializeComponent();
        }

        public void ClimbLadder(object sender, RoutedEventArgs e)
        {
            ladder(this, EventArgs.Empty);
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
    }
}
