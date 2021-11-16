# Base Vertex Class
class Vertex():
    def __init__(self, data):
        self.data = data

# Weighted Vertex


class DjikstraVertex(Vertex):
    def __init__(self, data, weight):
        super().__init__(data)
        self.weight = weight

    def getInfo(self):
        return (self.data, self.weight)

# Weighted and Hueristic Vertex


class AStarVertex(DjikstraVertex):
    def __init__(self, data, weight, hueristic):
        super().__init__(data, weight)
        self.hueristic = hueristic

    def getInfo(self):
        return (self.data, self.weight, self.hueristic)
