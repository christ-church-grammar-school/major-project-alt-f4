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
    /// Interaction logic for serverSelect.xaml
    /// </summary>
    public partial class serverSelect : Page
    {
        public EventHandler ladder;

        public String IP = "";

        public serverSelect()
        {
            InitializeComponent();
        }

        public void ClimbLadder(object sender, RoutedEventArgs e)
        {
            IP = "";
            ladder(this, EventArgs.Empty);
        }

        private void Join(object sender, RoutedEventArgs e)
        {
            IP = IPBox.Text;
            ladder(this, EventArgs.Empty);
        }
    }
}
