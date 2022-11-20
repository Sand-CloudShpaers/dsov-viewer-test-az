import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { DocumentComponentEmbedded } from '~ozon-model/documentComponentEmbedded';
import { OntwerpDocumentComponentEmbedded } from '~ozon-model/ontwerpDocumentComponentEmbedded';

export const mockOzonDocumentStructuurElementen: DocumentComponentEmbedded = {
  documentComponenten: [
    {
      _links: {
        self: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6/regelingen/_akn_nl_act_mnre1153_2021_N2000_003RGL_20210917_095947/documentcomponenten/formula_1_inst2',
        },
        isOnderdeelVan: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6/regelingen/_akn_nl_act_mnre1153_2021_N2000_003RGL_20210917_095947',
        },
      },
      identificatie: '/akn/nl/act/mnre1153/2021/N2000-003RGL-20210917-095947__formula_1_inst2',
      expressie: 'formula_1_inst2',
      type: 'AANHEF',
      volgordeNummer: 0,
      inhoud:
        '<Aanhef><Al>Onderstaand is de situatie weergegeven zoals die bestaat volgens het besluit/de' +
        ' besluiten van de Minister van Landbouw en Visserij van:</Al><Al>&lt;datum&gt;,' +
        ' &lt;nummer&gt;, zoals bekendgemaakt in &lt;stcrtnr&gt;.</Al><Al>De geconsolideerde inhoud is' +
        ' met zorg samengesteld en dient hier om de informatievoorziening in het Digitaal Stelsel Omgevingswet zo' +
        ' volledig mogelijk te maken.</Al><Al>De onderstaande informatie vervangt niet de juridische' +
        ' geldigheid van de genoemde besluiten.</Al><Al>De artikelen 3 en 4 zijn hier slechts' +
        ' opgenomen om geen elementen uit de formele besluiten weg te laten.</Al></Aanhef>',
      gereserveerd: false,
      vervallen: false,
      _embedded: {
        documentComponenten: [],
      },
    },
    {
      conditieArtikel: {
        inhoud:
          "<Inhoud xmlns='https://standaarden.overheid.nl/stop/imop/tekst/' xmlns:DSO-PI12='https://standaarden.overheid.nl/lvbb/DSO-PI12' xmlns:data='https://standaarden.overheid.nl/stop/imop/data/' xmlns:ns10='http://www.w3.org/2001/SMIL20/Language' xmlns:ns2='https://standaarden.overheid.nl/stop/imop/consolidatie/' xmlns:ns4='https://standaarden.overheid.nl/lvbb/stop/uitlevering/' xmlns:ns5='http://www.opengis.net/se' xmlns:ns6='http://www.w3.org/1999/xlink' xmlns:ns7='http://www.opengis.net/ogc' xmlns:ns8='http://www.opengis.net/gml' xmlns:ns9='http://www.w3.org/2001/SMIL20/'><Al>Inhoud van het artikel bij een conditie</Al></Inhoud>",
        opschrift:
          "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><Opschrift xmlns='https://standaarden.overheid.nl/stop/imop/tekst/' xmlns:ns6='http://www.w3.org/1999/xlink' xmlns:ns5='http://www.opengis.net/se' xmlns:ns8='http://www.opengis.net/gml' xmlns:ns7='http://www.opengis.net/ogc' xmlns:data='https://standaarden.overheid.nl/stop/imop/data/' xmlns:DSO-PI12='https://standaarden.overheid.nl/lvbb/DSO-PI12' xmlns:ns9='http://www.w3.org/2001/SMIL20/' xmlns:ns10='http://www.w3.org/2001/SMIL20/Language' xmlns:ns2='https://standaarden.overheid.nl/stop/imop/consolidatie/' xmlns:ns4='https://standaarden.overheid.nl/lvbb/stop/uitlevering/'>Bepaling conditie</Opschrift>",
      },
      identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__lichaam',
      type: DocumentBodyElementType.LICHAAM,
      nummer: '1',
      expressie: '',
      volgordeNummer: 1,
      _embedded: {
        documentComponenten: [
          {
            identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0',
            type: DocumentBodyElementType.DIVISIE,
            opschrift: 'Voorwoord',
            nummer: '0.',
            expressie: '',
            gereserveerd: false,
            volgordeNummer: 1,
            _embedded: {
              documentComponenten: [
                {
                  identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fdvs_o_1',
                  type: DocumentBodyElementType.DIVISIETEKST,
                  opschrift: 'Opbouw',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 1,
                  _embedded: {
                    documentComponenten: [],
                  },
                  _links: {
                    self: { href: '' },
                    isOnderdeelVan: { href: '' },
                    regeltekst: {
                      href: 'https://test.org/api/presenteren/v4/regelteksten/nl.imow-mn002.regeltekst.2019120111010010/',
                    },
                  },
                },
                {
                  identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fdvs_o_2',
                  type: DocumentBodyElementType.LID,
                  nummer: '1.',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 2,
                  _embedded: {
                    documentComponenten: [],
                  },
                  _links: {
                    self: { href: '' },
                    isOnderdeelVan: { href: '' },
                    regeltekst: {
                      href: 'https://test.org/api/presenteren/v4/regelteksten/nl.imow-mn002.regeltekst.2019120111010011/',
                    },
                  },
                },
              ],
            },
            _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
          },
        ],
      },
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
    {
      _links: {
        self: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6/regelingen/_akn_nl_act_mnre1153_2021_N2000_003RGL_20210917_095947/documentcomponenten/formula_1_inst2',
        },
        isOnderdeelVan: {
          href: 'https://nep-knooppunt-test.viewer.dso.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v6/regelingen/_akn_nl_act_mnre1153_2021_N2000_003RGL_20210917_095947',
        },
      },
      identificatie: '/akn/nl/act/mnre1153/2021/N2000-003RGL-20210917-095947__formula_1_inst2',
      expressie: 'formula_1_inst2',
      type: 'SLUITING',
      volgordeNummer: 0,
      inhoud:
        '<Sluiting><Al>Onderstaand is de situatie weergegeven zoals die bestaat volgens het besluit/de besluiten van' +
        ' de Minister van Landbouw en Visserij van:</Al><Al>&lt;datum&gt;, &lt;nummer&gt;, zoals' +
        ' bekendgemaakt in &lt;stcrtnr&gt;.</Al><Al>De geconsolideerde inhoud is met zorg samengesteld' +
        ' en dient hier om de informatievoorziening in het Digitaal Stelsel Omgevingswet zo volledig mogelijk te' +
        ' maken.</Al><Al>De onderstaande informatie vervangt niet de juridische geldigheid van de' +
        ' genoemde besluiten.</Al><Al>De artikelen 3 en 4 zijn hier slechts opgenomen om geen' +
        ' elementen uit de formele besluiten weg te laten.</Al></Sluiting>',
      gereserveerd: false,
      vervallen: false,
      _embedded: {
        documentComponenten: [],
      },
    },
    {
      type: DocumentBodyElementType.BIJLAGE,
      identificatie: 'bijlage',
      expressie: '',
      gereserveerd: false,
      volgordeNummer: 2,
      _links: null,
    },
  ],
};

export const mockOzonDocumentStructuurElementen2: DocumentComponentEmbedded = {
  documentComponenten: [
    {
      identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__body',
      type: 'LICHAAM',
      expressie: '',
      gereserveerd: false,
      volgordeNummer: 1,
      _embedded: {
        documentComponenten: [
          {
            identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0',
            type: 'DIVISIE',
            opschrift: 'Voorwoord',
            nummer: '0.',
            expressie: '',
            gereserveerd: false,
            volgordeNummer: 1,
            _embedded: {
              documentComponenten: [
                {
                  identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fdvs_o_1',
                  type: 'DIVISIE',
                  opschrift: '<Opschrift>Opbouw</Opschrift>',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 1,
                  _embedded: {
                    documentComponenten: [
                      {
                        identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fdvs_o_1__fcontent_o_1',
                        type: 'DIVISIETEKST',
                        expressie: '',
                        gereserveerd: false,
                        volgordeNummer: 1,
                        inhoud:
                          '<div xmlns="https://www.overheid.nl/namespaces/stop" class="od-FormeleInhoud">\n    <div class="od-Al">In hoofdstuk 1 (Inleiding) geven we aan waarom we een Omgevingsvisie maken en hoe deze tot stand is gekomen. In hoofdstuk 2 (Visie) gaan we in op de visie op 2050, de kwaliteiten van de topregio Utrecht en de maatschappelijke opgaven. Hoofdstuk 3 (Basis) bevat onze sturingsfilosofie, onze provinciale belangen en onze uitgangspunten voor het beleid. In hoofdstuk 4 (gezonde en veilige leefomgeving) staan onze ambities en beleidskeuzes voor zeven prioritaire beleidsthema&rsquo;s;</div>\n    <div class="od-Lijst">\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">stad en land gezond;</div>\n        </div>\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">klimaatbestendig en waterrobuust;</div>\n        </div>\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">duurzame energie;</div>\n        </div>\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">vitale steden en dorpen;</div>\n        </div>\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">duurzaam, gezond en veilig bereikbaar;</div>\n        </div>\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">levend landschap, erfgoed en cultuur;</div>\n        </div>\n        <div class="od-Li">\n            <div class="od-LiNummer">-</div>\n            <div class="od-Al">toekomstbestendige natuur en landbouw.</div>\n        </div>\n    </div>\n    <div class="od-Al">In hoofdstuk 5 (Gebieden) brengen wij de ambities en keuzes gebiedsgericht samen en geven we aan wat dit betekent voor keuzes in de regio&rsquo;s U16, Amersfoort en Foodvalley. In hoofdstuk 6 (Uitvoering) geven we aan hoe we uitvoering willen geven aan deze Omgevingsvisie via programma&rsquo;s, samenwerken, regionaal programmeren, participatie, gebiedsaanpak en de Omgevingsverordening.</div>\n    <div class="od-Figuur">\n        <a href="https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/afbeeldingen/pv26/_akn_nl_act_pv26_2019_OVPU_20191211/image_001.jpeg">image_001.jpeg</a>\n        <div class="od-Bijschrift">Afbeelding a: Verhaallijn Provinciale Omgevingsvisie Utrecht</div>\n    </div>\n</div>\n',
                        _links: {
                          self: {
                            href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/documenten/_akn_nl_act_pv26_2019_OVPU_20191211/structuur/pv26_1__fdvs_0__fdvs_o_1__fcontent_o_1',
                          },
                          isOnderdeelVan: {
                            href: '',
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    self: {
                      href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/documenten/_akn_nl_act_pv26_2019_OVPU_20191211/structuur/pv26_1__fdvs_0__fdvs_o_1',
                    },
                    isOnderdeelVan: {
                      href: '',
                    },
                  },
                },
                {
                  identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fcontent_o_1',
                  type: 'DIVISIETEKST',
                  opschrift: 'test',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 2,
                  inhoud:
                    '<div xmlns="https://www.overheid.nl/namespaces/stop" class="od-FormeleInhoud">    <div class="od-Al">In de Omgevingsvisie en -verordening van de provincie Utrecht beschrijven we hoe wij ons willen voorbereiden op de toekomst, gezien alle ontwikkelingen die op ons afkomen en ruimte vragen in onze kleine provincie. Denk daarbij aan de groeiende behoefte aan [DIT IS EEN CONCEPTTEKST] woningen en bereikbaarheid, de aantrekkende economie, de energietransitie, de klimaatadaptatie en het tegengaan van bodemdaling. Slimme combinaties van functies en maatwerk per gebied zijn nodig om het mooie diverse landschap te behouden en versterken.</div>    <div class="od-Al">Wij bieden ruimte aan nieuwe ontwikkelingen en vinden aanpassingsvermogen belangrijk. Door mee te bewegen, bij te sturen of juist te intensiveren kunnen we onze doelen het best &ndash; in samenspraak met andere overheden &ndash; halen. Dit betekent dat we vertrouwen geven en denken in kansen. En dat wij kaders en regels meegeven en verantwoordelijkheid nemen voor onze provinciale belangen.</div>    <div class="od-Al">Het concept ontwerp is een tussenstap op weg naar de uiteindelijke Omgevingsvisie. Met de reacties op het concept gaan we verder aan de slag om op 17 maart 2020 de ontwerp Omgevingsvisie, -verordening en planMER vastte stellen. De ontwerp Omgevingsvisie komt ter inzage te liggen van 7 april t/m 18 mei 2020. In die periode vinden er ook informatiebijeenkomsten op diverse verbeeldingen in de provincie plaats en organiseren PS hoorzittingen. Na het verwerken van alle zienswijzen (reacties op terinzagelegging) stellen PS eind 2020 de definitieve Omgevingsvisie en Omgevingsverordering vast.</div>    <div class="od-Al">Voor het opstellen van de Omgevingsvisie en de Omgevingsverordening hebben wij als provincie intensief samengewerkt met andere partijen, zoals gemeenten, waterschappen, maatschappelijke organisaties ondernemers, inwoners en andere belanghebbenden. De samenwerking met mede-overheden is een goede voorbereiding op de Omgevingswet, die van ons vraagt om vanaf 1 januari 2021 op te treden als &eacute;&eacute;n overheid.</div></div>',
                  _links: {
                    self: {
                      href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/documenten/_akn_nl_act_pv26_2019_OVPU_20191211/structuur/pv26_1__fdvs_0__fcontent_o_1',
                    },
                    isOnderdeelVan: {
                      href: '',
                    },
                  },
                },
                {
                  identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fcontent_o_1',
                  type: 'DIVISIETEKST',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 3,
                  inhoud:
                    '<div xmlns="https://www.overheid.nl/namespaces/stop" class="od-FormeleInhoud">    <div class="od-Al">In de Omgevingsvisie en -verordening van de provincie Utrecht beschrijven we hoe wij ons willen voorbereiden op de toekomst, gezien alle ontwikkelingen die op ons afkomen en ruimte vragen in onze kleine provincie. Denk daarbij aan de groeiende behoefte aan [DIT IS EEN CONCEPTTEKST] woningen en bereikbaarheid, de aantrekkende economie, de energietransitie, de klimaatadaptatie en het tegengaan van bodemdaling. Slimme combinaties van functies en maatwerk per gebied zijn nodig om het mooie diverse landschap te behouden en versterken.</div>    <div class="od-Al">Wij bieden ruimte aan nieuwe ontwikkelingen en vinden aanpassingsvermogen belangrijk. Door mee te bewegen, bij te sturen of juist te intensiveren kunnen we onze doelen het best &ndash; in samenspraak met andere overheden &ndash; halen. Dit betekent dat we vertrouwen geven en denken in kansen. En dat wij kaders en regels meegeven en verantwoordelijkheid nemen voor onze provinciale belangen.</div>    <div class="od-Al">Het concept ontwerp is een tussenstap op weg naar de uiteindelijke Omgevingsvisie. Met de reacties op het concept gaan we verder aan de slag om op 17 maart 2020 de ontwerp Omgevingsvisie, -verordening en planMER vastte stellen. De ontwerp Omgevingsvisie komt ter inzage te liggen van 7 april t/m 18 mei 2020. In die periode vinden er ook informatiebijeenkomsten op diverse verbeeldingen in de provincie plaats en organiseren PS hoorzittingen. Na het verwerken van alle zienswijzen (reacties op terinzagelegging) stellen PS eind 2020 de definitieve Omgevingsvisie en Omgevingsverordering vast.</div>    <div class="od-Al">Voor het opstellen van de Omgevingsvisie en de Omgevingsverordening hebben wij als provincie intensief samengewerkt met andere partijen, zoals gemeenten, waterschappen, maatschappelijke organisaties ondernemers, inwoners en andere belanghebbenden. De samenwerking met mede-overheden is een goede voorbereiding op de Omgevingswet, die van ons vraagt om vanaf 1 januari 2021 op te treden als &eacute;&eacute;n overheid.</div></div>',
                  _links: {
                    self: {
                      href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/documenten/_akn_nl_act_pv26_2019_OVPU_20191211/structuur/pv26_1__fdvs_0__fcontent_o_1',
                    },
                    isOnderdeelVan: {
                      href: '',
                    },
                  },
                },
                {
                  identificatie: '/akn/nl/act/pv26/2019/OVPU-20191211__pv26_1__fdvs_0__fcontent_o_2',
                  type: 'LID',
                  nummer: '1.',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 4,
                  inhoud:
                    '<div xmlns="https://www.overheid.nl/namespaces/stop" class="od-FormeleInhoud">    <div class="od-Al">In de Omgevingsvisie en -verordening van de provincie Utrecht beschrijven we hoe wij ons willen voorbereiden op de toekomst, gezien alle ontwikkelingen die op ons afkomen en ruimte vragen in onze kleine provincie. Denk daarbij aan de groeiende behoefte aan [DIT IS EEN CONCEPTTEKST] woningen en bereikbaarheid, de aantrekkende economie, de energietransitie, de klimaatadaptatie en het tegengaan van bodemdaling. Slimme combinaties van functies en maatwerk per gebied zijn nodig om het mooie diverse landschap te behouden en versterken.</div>    <div class="od-Al">Wij bieden ruimte aan nieuwe ontwikkelingen en vinden aanpassingsvermogen belangrijk. Door mee te bewegen, bij te sturen of juist te intensiveren kunnen we onze doelen het best &ndash; in samenspraak met andere overheden &ndash; halen. Dit betekent dat we vertrouwen geven en denken in kansen. En dat wij kaders en regels meegeven en verantwoordelijkheid nemen voor onze provinciale belangen.</div>    <div class="od-Al">Het concept ontwerp is een tussenstap op weg naar de uiteindelijke Omgevingsvisie. Met de reacties op het concept gaan we verder aan de slag om op 17 maart 2020 de ontwerp Omgevingsvisie, -verordening en planMER vastte stellen. De ontwerp Omgevingsvisie komt ter inzage te liggen van 7 april t/m 18 mei 2020. In die periode vinden er ook informatiebijeenkomsten op diverse verbeeldingen in de provincie plaats en organiseren PS hoorzittingen. Na het verwerken van alle zienswijzen (reacties op terinzagelegging) stellen PS eind 2020 de definitieve Omgevingsvisie en Omgevingsverordering vast.</div>    <div class="od-Al">Voor het opstellen van de Omgevingsvisie en de Omgevingsverordening hebben wij als provincie intensief samengewerkt met andere partijen, zoals gemeenten, waterschappen, maatschappelijke organisaties ondernemers, inwoners en andere belanghebbenden. De samenwerking met mede-overheden is een goede voorbereiding op de Omgevingswet, die van ons vraagt om vanaf 1 januari 2021 op te treden als &eacute;&eacute;n overheid.</div></div>',
                  _links: {
                    self: {
                      href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/documenten/_akn_nl_act_pv26_2019_OVPU_20191211/structuur/pv26_1__fdvs_0__fcontent_o_2',
                    },
                    isOnderdeelVan: {
                      href: '',
                    },
                  },
                },
              ],
            },
            _links: {
              divisieannotatie: {
                href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/divisies/nl.imow-pv26.divisie.2019000001',
              },
              isOnderdeelVan: {
                href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/divisies/nl.imow-pv26.divisie.2019000001',
              },
              self: {
                href: 'https://lvbbod-worker.in.kadaster.nl/publiek/omgevingsdocumenten/api/presenteren/v4/documenten/_akn_nl_act_pv26_2019_OVPU_20191211/structuur/pv26_1__fdvs_0',
              },
            },
          },
        ],
      },
      _links: {
        self: {
          href: '',
        },
        isOnderdeelVan: {
          href: '',
        },
      },
    },
  ],
};

export const mockDocumentStructuurForRegelsOpMaat: DocumentComponentEmbedded = {
  documentComponenten: [
    {
      identificatie: 'lichaamId',
      type: 'LICHAAM',
      expressie: '',
      gereserveerd: false,
      volgordeNummer: 1,
      _embedded: {
        documentComponenten: [
          {
            identificatie: 'artikelId',
            type: 'ARTIKEL',
            label: 'Artikel',
            opschrift: '<Opschrift>Artikel</Opschrift>',
            nummer: '1',
            expressie: '',
            gereserveerd: false,
            volgordeNummer: 1,
            _embedded: {
              documentComponenten: [
                {
                  identificatie: 'paragraafId',
                  type: 'PARAGRAAF',
                  label: '§',
                  opschrift: '<Opschrift>Paragraaf</Opschrift>',
                  expressie: '',
                  gereserveerd: false,
                  volgordeNummer: 1,
                  _embedded: {
                    documentComponenten: [
                      {
                        identificatie: 'lidId',
                        type: 'LID',
                        expressie: '',
                        gereserveerd: false,
                        volgordeNummer: 1,
                        inhoud: '<Inhoud>inhoud</Inhoud>',
                        _links: {
                          self: {
                            href: '',
                          },
                          isOnderdeelVan: {
                            href: '',
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    self: {
                      href: '',
                    },
                    isOnderdeelVan: {
                      href: '',
                    },
                  },
                },
              ],
            },
            _links: {
              divisieannotatie: {
                href: '',
              },
              isOnderdeelVan: {
                href: '',
              },
              self: {
                href: '',
              },
            },
          },
        ],
      },
      _links: {
        self: {
          href: '',
        },
        isOnderdeelVan: {
          href: '',
        },
      },
    },
  ],
};

export const mockOzonDocumentStructuurElementenWithBijlagen: DocumentComponentEmbedded = {
  documentComponenten: [
    {
      identificatie: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_III',
      inhoud: '<Inhoud></Inhoud>',
      nummer: 'III',
      opschrift: '<Opschrift>BIJ HOOFDSTUK 2 VAN DEZE REGELING</Opschrift>',
      label: 'Bijlage',
      type: DocumentBodyElementType.BIJLAGE,
      expressie: 'Inhoud',
      volgordeNummer: 1,
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
    {
      identificatie: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_XXXI',
      nummer: 'XXXI',
      label: 'Bijlage',
      type: DocumentBodyElementType.BIJLAGE,
      expressie: 'cmp_XXXI',
      volgordeNummer: 2,
      _embedded: {
        documentComponenten: [
          {
            expressie: 'cmp_XXXI__content_o_1',
            gereserveerd: false,
            identificatie: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_XXXI__content_o_1',
            inhoud: '<Inhoud></Inhoud>',
            type: 'DIVISIETEKST',
            vervallen: false,
            volgordeNummer: 0,
            _embedded: {
              documentComponenten: [
                {
                  expressie: 'cmp_XXXI__content_o_1__list_o_1__item_o_1',
                  gereserveerd: false,
                  identificatie: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_XXXI__content_o_1__list_o_1__item_o_1',
                  inhoud: '<Begrip></Begrip>',
                  type: 'BEGRIP',
                  vervallen: false,
                  volgordeNummer: 0,
                  _embedded: {
                    documentComponenten: [],
                  },
                  _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
                },
                {
                  _links: {
                    self: {
                      href: 'http://localhost:8080/publiek/omgevingsdocumenten/api/presenteren/v7/regelingen/_akn_nl_act_gm0363_2022_Regelingc4fd804c803345f99f49cd27c75fbc7e/documentcomponenten/gm0363_025a2e8f440e42689861af82f65c864a__cmp_o_1__content_o_1__list_o_1__item_o_1?geldigOp=2022-10-05&inWerkingOp=2022-10-05&beschikbaarOp=2022-10-05T15:43:14Z',
                    },
                    isOnderdeelVan: {
                      href: 'http://localhost:8080/publiek/omgevingsdocumenten/api/presenteren/v7/regelingen/_akn_nl_act_gm0363_2022_Regelingc4fd804c803345f99f49cd27c75fbc7e?geldigOp=2022-10-05&inWerkingOp=2022-10-05&beschikbaarOp=2022-10-05T15:43:14Z',
                    },
                    valtOnder: {
                      href: 'http://localhost:8080/publiek/omgevingsdocumenten/api/presenteren/v7/regelingen/_akn_nl_act_gm0363_2022_Regelingc4fd804c803345f99f49cd27c75fbc7e/documentcomponenten/gm0363_1bb770c166e846cc81b832c6ae1e7f42__cmp_o_1__content_o_1?geldigOp=2022-10-05&inWerkingOp=2022-10-05&beschikbaarOp=2022-10-05T15:43:14Z',
                    },
                  },
                  identificatie: 'gm0363_025a2e8f440e42689861af82f65c864a__cmp_o_1__content_o_1__list_o_1__item_o_1',
                  expressie: 'ExtIoRef',
                  type: 'BEGRIP',
                  volgordeNummer: 1,
                  inhoud:
                    "<Begrip xmlns='https://standaarden.overheid.nl/stop/imop/tekst/' xmlns:DSO-PI12='https://standaarden.overheid.nl/lvbb/DSO-PI12' xmlns:data='https://standaarden.overheid.nl/stop/imop/data/' xmlns:ns10='http://www.w3.org/2001/SMIL20/Language' xmlns:ns2='https://standaarden.overheid.nl/stop/imop/consolidatie/' xmlns:ns4='https://standaarden.overheid.nl/lvbb/stop/uitlevering/' xmlns:ns5='http://www.opengis.net/se' xmlns:ns6='http://www.w3.org/1999/xlink' xmlns:ns7='http://www.opengis.net/ogc' xmlns:ns8='http://www.opengis.net/gml' xmlns:ns9='http://www.w3.org/2001/SMIL20/' eId='cmp_o_1__content_o_1__list_o_1__item_o_53' wId='gm0363_025a2e8f440e42689861af82f65c864a__cmp_o_1__content_o_1__list_o_1__item_o_1'><Term>bouwvlak</Term><Definitie><Al><ExtIoRef xmlns='' wId='gm0363_0dd3bcf363014bbeb08e7ee80f4dbb35__cmp_o_1__content_o_1__list_o_1__item_o_1__ref_o_1' href='https://identifier-eto.overheid.nl//join/id/regdata/gm0363/2022/0690cb9f55de41989e70c07bf2355270/nld@2022-07-13'>/join/id/regdata/gm0363/2022/0690cb9f55de41989e70c07bf2355270/nld@2022-07-13</ExtIoRef></Al></Definitie></Begrip>",
                  gereserveerd: false,
                  vervallen: false,
                  geregistreerdMet: {
                    versie: 1,
                    beginInwerking: '2022-07-14',
                    beginGeldigheid: '2022-07-14',
                    tijdstipRegistratie: '2022-08-30T14:32:39.044556Z',
                  },
                  _embedded: {
                    documentComponenten: [],
                  },
                },
              ],
            },
            _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
          },
        ],
      },
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
    {
      identificatie: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_XXXI_gereserveerd',
      opschrift: '<Opschrift>testOpschrift</Opschrift>',
      label: 'Bijlage',
      type: DocumentBodyElementType.BIJLAGE,
      gereserveerd: true,
      expressie: '',
      volgordeNummer: 3,
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
    {
      identificatie: '/akn/nl/act/mn002/2019/reg0001__mn002_1-0__cmp_XXXI_gereserveerd',
      label: 'Bijlage',
      type: DocumentBodyElementType.BIJLAGE,
      inhoud: '',
      expressie: '',
      volgordeNummer: 4,
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
    {
      identificatie: '',
      type: DocumentBodyElementType.LICHAAM,
      nummer: '1',
      _embedded: {
        documentComponenten: [],
      },
      expressie: '',
      volgordeNummer: 5,
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
  ],
};

export const mockOntwerpDocumentComponentEmbedded: OntwerpDocumentComponentEmbedded = {
  ontwerpDocumentComponenten: [
    {
      identificatie: 'lichaam',
      type: DocumentBodyElementType.LICHAAM,
      nummer: '1',
      expressie: '',
      volgordeNummer: 1,
      _embedded: {
        ontwerpDocumentComponenten: [
          {
            identificatie: 'artikel',
            type: DocumentBodyElementType.ARTIKEL,
            opschrift: '<Opschrift>Artikel</Opschrift>',
            nummer: '1.',
            expressie: '',
            gereserveerd: false,
            volgordeNummer: 1,
            bevatOntwerpInformatie: true,
            geregistreerdMet: {
              versie: null,
              tijdstipRegistratie: null,
              eindRegistratie: null,
              status: null,
            },
            _links: { self: { href: '' }, isOnderdeelVan: { href: '' }, regeltekst: { href: 'regeltekstLink' } },
          },
        ],
      },
      geregistreerdMet: {
        versie: null,
        tijdstipRegistratie: null,
        eindRegistratie: null,
        status: null,
      },
      _links: { self: { href: '' }, isOnderdeelVan: { href: '' } },
    },
  ],
};
