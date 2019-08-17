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
    /// Interaction logic for GameUI.xaml
    /// </summary>
    public partial class GameUI : Page
    {
        public EventHandler ladder;
        int deckMoveCounter = 1;

        public GameUI()
        {
            InitializeComponent();

            
            
        }

        public void summonDeckCard(object sender, RoutedEventArgs e)
        {
            int x = deckMoveCounter * 60;
            Button newbutton = new Button();
            Image image = new Image();
            image.Source = new BitmapImage( new Uri($"cards/cardback print.jpg", UriKind.Relative));
            newbutton.Content = image;
            GameUIGrid.Children.Add(newbutton);
            newbutton.Margin = new Thickness(320+x, 387, 430-x, 0);

            deckMoveCounter++;
        }

        public void ClimbLadder(object sender, RoutedEventArgs e)
        {
            ladder(this, EventArgs.Empty);
        }
        
    }
}
