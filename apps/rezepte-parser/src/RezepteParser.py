# -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
#  File Name : rezeptParser.py
#
#  Purpose :
#
#  Creation Date : 23-10-2020
#  Last Modified : Fr Okt 23, 2020  17:01:36
#  Created By : Tim Seyschab
# ._._._._._._._._._._._._._._._._._._._._.

import xml.etree.ElementTree as ET
import sys
from elasticsearch import Elasticsearch
import re

from rezept import Rezept, Zutat

einheiten = ["g", "EL", "TL", "kg", "Bd.", "Stück", "ml", "l", "Liter", "cm", "m.-große"]


def main(document):
    tree = ET.parse(document)
    root = tree.getroot()
    es = Elasticsearch("http://shellnuts.de:9200")
    kategorienTag = None

    for child in root:
        if child.tag != "Kategorien":
            continue
        else:
            kategorienTag = child
            break

    for kategorie in kategorienTag:
        if kategorie.tag == "Kategorie":
            kategorieName = kategorie.attrib["Name"]
            for rezept in kategorie:
                if rezept.tag == "Rezept":
                    es.index(index="rezepte", body=createjson(rezept, kategorieName))


def trim(elem):
    elem = elem.strip()
    elem = re.sub(r"^\d+\.", "", elem)
    return elem.strip()


def parsezutaten(child):
    liste = []
    zutaten = map(trim, child.text.split("\n"))
    for zutat in zutaten:
        index = 0
        rezeptzutat = Zutat()
        splitted = zutat.split(" ")
        if len(splitted) == 1 and len(splitted[0]) == 0:
            continue

        if len(splitted) > 1:
            try:
                menge = float(splitted[0])
                rezeptzutat.addMenge(menge)
                index = index + 1
            except ValueError:
                pass
        if len(splitted) > 2 and index > 0:
            if splitted[1] in einheiten:
                rezeptzutat.addEinheit(splitted[1])
                index = index + 1
        rezeptzutat.addZutat(" ".join(splitted[index:]))
        liste.append(rezeptzutat)
    return liste


def parsezubereitung(child):
    return "\n".join(map(trim, child.text.split("\n")))


def createjson(element, kategorie):
    attr = element.attrib
    rezept = Rezept(kategorie, attr["Name"], attr["Quelle"], attr["PersonenAnzahl"], attr["DauerString"])
    for child in element:
        if child.tag == "Zutaten":
            rezept.addZutatenListe(parsezutaten(child))
        elif child.tag == "Zubereitung":
            zubereitung = parsezubereitung(child)
            rezept.addZubereitung(zubereitung)
    return rezept.toJson()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Bitte Datei mit angeben!")
        exit(1)

    main(sys.argv[1])
