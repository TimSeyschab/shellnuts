import json


class Rezept:

    def __init__(self, kategorie, titel, quelle, personen, dauer):
        self.dauer = dauer
        self.personen = int(personen)
        self.quelle = quelle
        self.titel = titel
        self.kategorie = kategorie
        self.zutaten = []
        self.zubereitung = ""

    def addZutatenListe(self, zutaten):
        self.zutaten = zutaten

    def addZubereitung(self, zubereitung):
        self.zubereitung = zubereitung

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


class Zutat:

    def __init__(self):
        self.zutat = None
        self.einheit = None
        self.menge = None

    def addMenge(self, menge):
        self.menge = menge

    def addEinheit(self, einheit):
        self.einheit = einheit

    def addZutat(self, zutat):
        self.zutat = zutat

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)
