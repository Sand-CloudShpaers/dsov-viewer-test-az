# Genereren van iconenbibliotheek en stijlen

Op https://www.geonovum.nl/geo-standaarden/omgevingswet/STOPTPOD staat een link "Symbolenbibliotheek STOP-TPOD", die
verwijst naar
een ZIP-file. Hierin bevinden zich de stijlen (css) en iconen (png en sld) die nodig zijn om de iconen in de viewer te
visualiseren.

## Genereren punt- en lijnsymbolen

A.d.h.v. de puntsymbolisatie en lijnsymbolisatie zijn 3 xslt-bestanden ontwikkeld:

- `src/generation/assets/xslt/puntsymbolen-svg.xslt` waarmee uit het bronbestand de svg's voor de puntsymbolisatie
  worden gegenereerd;
- `src/generation/assets/xslt/lijnsymbolen-svg.xslt` waarmee uit het bronbestand de svg's voor de lijnsymbolisatie
  worden gegenereerd;
- `src/generation/assets/xslt/scss.xslt` waarmee uit de bronbestanden de scss voor de punt- en lijnsymbolisaties
  worden gegenereerd.

Hiervoor zijn 4 npm scripts toegevoegd:

- `xslt:ps-svg` genereren van svg's van puntsymbolen
- `xslt:ls-svg` genereren van svg's van lijnsymboken
- `xslt:ps-scss` genereren van scss voor type=punt
- `xslt:ls-scss` genereren van scss voor type=lijn

De script maken gebruik van de dev-dependency [xslt3](https://www.npmjs.com/package/xslt3). Voor meer in depth
informatie zie https://www.saxonica.com/documentation11/index.html

# Genereren vlaksymbolen en normwaarden

In de ZIP zitten ook CSS en PNG bestanden die nodig zijn voor de vlaksymbolisatie en de normwaarden.
Met behulp van de volgende stappen kunnen deze aan de viewer worden toegevoegd.

Het genereren van de CSS:

* Open het CSS bestanden met uit de ZIP (vlak_symbolen en normwaarden)
* Vervang in beide bestanden `symboolcode vlak[id=` met `.symboolcode[data-symboolcode=`
* Vervang in beide bestanden `::after` met ` ` (spatie)
* Plaats het nieuwe normwaarden bestand in de map `/src/assets/symbolen/dso-symbolen-normwaarden.scss`
* Voor de vlak_symbolen CSS moeten ook nog de links naar de symbolen worden vervangen:  `../Symbols/png_laag/`
  met `./symbols/vlak/`
* Plaats het nieuwe vlak_symbolen bestand in de map `/src/assets/symbolen/dso-symbolen-vlakken.scss`

Toevoegen van afbeeldingen voor vlak_symbolen (png):

* Maak de map leeg: `/src/assets/symbolen/symbols/vlak`
* Kopieer de bestanden uit de map `png_laag` van de ZIP en plaats ze in de leeggemaakte map
