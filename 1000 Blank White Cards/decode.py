"""class card:
  def __init__(self, colour, radius):
      self.colour = colour
      self.radius = radius

x = [[None if i == "???" else i.lower() for i in i.strip().split(';')] for i in open("test cards.txt").readlines()]
cards = {}
for i in x:
    cards[i[0]] = i[1:]"""

x = input()
print(x)
x = x.split(";")
print(x)
x[0] = x[0].lower()
x[2] = [i.strip() for i in x[2].strip().split()]
if x[2][-1][-1] == "," or x[2][-1][-1] == ";":
    x[2][-1][-1] == ""
print(x)
x = {"name":x[0], "author":x[1], "traits":x[2]}
print(x) 