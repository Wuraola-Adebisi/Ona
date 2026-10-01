import type { Activity, Destination, DestinationId, Interest, Role } from '../types'

// Sample data for the demo. Venue names are real places, but hours, prices and
// availability are not modelled. Check them before travelling.

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

interface Opt {
  indoor?: boolean
  tourist?: 0 | 1 | 2 | 3
  energy?: 1 | 2 | 3
}

const INDOOR_ROLES: Role[] = ['coffee', 'lunch', 'dinner', 'evening']

const maker =
  (zone: string) =>
  (
    role: Role,
    name: string,
    area: string,
    minutes: number,
    tags: Interest[],
    note: string,
    o: Opt = {},
  ): Activity => ({
    id: `${zone}-${role}-${slug(name)}`,
    zone,
    role,
    name,
    area,
    minutes,
    tags,
    note,
    indoor: o.indoor ?? INDOOR_ROLES.includes(role),
    tourist: o.tourist ?? 1,
    energy: o.energy ?? (INDOOR_ROLES.includes(role) ? 1 : 2),
  })

// ---------------------------------------------------------------- LISBON
const lAlfama = maker('alfama')
const lBaixa = maker('baixa')
const lBelem = maker('belem')
const lPrincipe = maker('principe')
const lBeach = maker('cascais')

const lisbon: Destination = {
  id: 'lisbon',
  name: 'Lisbon',
  country: 'Portugal',
  tagline: 'Tiled hills, river light and long lunches.',
  palette: { sky: '#f1d3a5', sun: '#e08e45', far: '#8aa4c0', mid: '#3d5b86', near: '#14233f', accent: '#faf3e4' },
  zones: [
    { id: 'alfama', title: 'Old Lisbon', blurb: 'Steep lanes, tiled facades and the oldest views in the city.', iconic: true },
    { id: 'baixa', title: 'Baixa and Chiado', blurb: 'Grand squares, bookshops and the streets that were rebuilt after 1755.' },
    { id: 'belem', title: 'Belém', blurb: 'Monuments and museums along the river, west of the centre.' },
    { id: 'principe', title: 'Design Lisbon', blurb: 'Gardens, galleries and independent shops across Príncipe Real and Estrela.' },
    { id: 'cascais', title: 'Beach day', blurb: 'A train ride west to Cascais for sea air and an unhurried day.', optional: ['beach', 'nature'] },
  ],
  activities: [
    lAlfama('coffee', 'Copenhagen Coffee Lab', 'Old Lisbon', 45, ['cafes', 'food'], 'Specialty coffee and a pastry before the climb.'),
    lAlfama('morning', 'Alfama walk', 'Alfama', 120, ['architecture', 'history', 'views'], 'Lanes, staircases and tiled facades on foot.', { tourist: 1 }),
    lAlfama('morning', 'Sé de Lisboa', 'Alfama', 45, ['architecture', 'history'], 'The Romanesque cathedral at the foot of the hill.', { indoor: true, tourist: 2, energy: 1 }),
    lAlfama('lunch', 'Pois Café', 'Alfama', 75, ['cafes', 'food'], 'Light lunch in a relaxed, sofa-filled café.'),
    lAlfama('afternoon', 'Museu Nacional do Azulejo', 'Xabregas', 120, ['architecture', 'galleries', 'history'], 'Five centuries of Portuguese tilework in a former convent.', { indoor: true, energy: 1 }),
    lAlfama('afternoon', 'Museu do Fado', 'Alfama', 75, ['history', 'galleries'], 'A compact museum on Lisbon\u2019s music and its neighbourhoods.', { indoor: true, tourist: 2, energy: 1 }),
    lAlfama('afternoon2', 'Castelo de São Jorge', 'Alfama', 90, ['history', 'views', 'architecture'], 'A hilltop castle with wide views over the river.', { tourist: 3, energy: 3 }),
    lAlfama('sunset', 'Miradouro da Graça', 'Graça', 60, ['views', 'nature'], 'A pine-shaded viewpoint with a kiosk, quieter than most.', { tourist: 1 }),
    lAlfama('sunset', 'Miradouro de Santa Luzia', 'Alfama', 45, ['views', 'architecture'], 'A tiled terrace over red roofs and the river.', { tourist: 2, energy: 1 }),
    lAlfama('dinner', 'Clube de Fado', 'Alfama', 120, ['food', 'history', 'nightlife'], 'Portuguese dinner with live fado in a vaulted cellar.', { tourist: 2 }),
    lAlfama('dinner', 'Tasca dinner in Mouraria', 'Mouraria', 90, ['food'], 'A small family-run place serving grilled fish and the dish of the day.', { tourist: 0 }),
    lAlfama('evening', 'Fado in a neighbourhood tasca', 'Alfama', 90, ['nightlife', 'history'], 'Live fado in a room that seats thirty.', { tourist: 1 }),

    lBaixa('coffee', 'Café A Brasileira', 'Chiado', 40, ['cafes', 'history'], 'An art deco café that has been open since 1905.', { tourist: 2 }),
    lBaixa('coffee', 'Fábrica Coffee Roasters', 'Baixa', 40, ['cafes'], 'An independent roaster near Restauradores.', { tourist: 0 }),
    lBaixa('morning', 'Praça do Comércio', 'Baixa', 75, ['architecture', 'history'], 'The riverside square rebuilt after the 1755 earthquake.', { tourist: 3, energy: 1 }),
    lBaixa('morning', 'Convento do Carmo', 'Chiado', 60, ['architecture', 'history'], 'Gothic church ruins left open to the sky since 1755.', { tourist: 2, energy: 1 }),
    lBaixa('lunch', 'Time Out Market Lisboa', 'Cais do Sodré', 75, ['food'], 'A food hall with dozens of stalls, so nobody has to agree on one dish.', { tourist: 3 }),
    lBaixa('lunch', 'Prato do dia in a Baixa tasca', 'Baixa', 60, ['food'], 'The set lunch most offices in the area eat.', { tourist: 0 }),
    lBaixa('afternoon', 'Livraria Bertrand', 'Chiado', 75, ['shopping', 'history', 'cafes'], 'Portugal\u2019s oldest bookshop, with good neighbours.', { indoor: true, energy: 1 }),
    lBaixa('afternoon', 'Museu Nacional de Arte Antiga', 'Santos', 120, ['galleries', 'history'], 'The country\u2019s main collection of older art, rarely crowded.', { indoor: true, energy: 1 }),
    lBaixa('afternoon2', 'Elevador de Santa Justa', 'Baixa', 45, ['architecture', 'views'], 'A neo-Gothic iron lift with a viewing platform.', { tourist: 3, energy: 1 }),
    lBaixa('sunset', 'Miradouro de São Pedro de Alcântara', 'Bairro Alto', 60, ['views'], 'A city view across to the castle, with a small kiosk.', { tourist: 2, energy: 1 }),
    lBaixa('dinner', 'Cervejaria Ramiro', 'Intendente', 90, ['food'], 'Loud, very good seafood. Go early or expect a queue.', { tourist: 3 }),
    lBaixa('dinner', 'Taberna da Rua das Flores', 'Chiado', 90, ['food'], 'Small plates of Portuguese dishes on a short, changing menu.', { tourist: 2 }),
    lBaixa('evening', 'Rua Nova do Carvalho bars', 'Cais do Sodré', 90, ['nightlife'], 'The pink street, lined with small bars.', { tourist: 2 }),

    lBelem('coffee', 'Pastéis de Belém', 'Belém', 45, ['food', 'cafes', 'history'], 'Custard tarts from the original bakery.', { tourist: 3 }),
    lBelem('morning', 'Mosteiro dos Jerónimos', 'Belém', 90, ['architecture', 'history'], 'A Manueline monastery with a two-storey cloister.', { indoor: true, tourist: 3, energy: 1 }),
    lBelem('lunch', 'Lunch near the Belém riverfront', 'Belém', 75, ['food'], 'Grilled fish at a table close to the water.', { tourist: 1 }),
    lBelem('afternoon', 'MAAT', 'Belém', 120, ['architecture', 'galleries'], 'The Museum of Art, Architecture and Technology, with a roof you can walk on.', { indoor: true, energy: 1 }),
    lBelem('afternoon', 'Torre de Belém', 'Belém', 45, ['architecture', 'history'], 'A sixteenth-century tower standing in the river.', { tourist: 3 }),
    lBelem('afternoon2', 'Jardim Botânico Tropical', 'Belém', 60, ['nature'], 'A quiet tropical garden behind the monastery.', { tourist: 0, energy: 1 }),
    lBelem('sunset', 'Padrão dos Descobrimentos', 'Belém', 60, ['views', 'history'], 'A monument on the water with open sky for the last light.', { tourist: 2, energy: 1 }),
    lBelem('dinner', 'Dinner in Santos', 'Santos', 90, ['food'], 'A neighbourhood room between Belém and the centre.', { tourist: 0 }),

    lPrincipe('coffee', 'Coffee in Jardim do Príncipe Real', 'Príncipe Real', 40, ['cafes'], 'A kiosk under the old cedar tree in the garden.', { tourist: 0 }),
    lPrincipe('morning', 'Basílica da Estrela', 'Estrela', 90, ['architecture', 'nature'], 'A domed basilica beside a shaded public garden.', { tourist: 1, energy: 1 }),
    lPrincipe('morning', 'Embaixada', 'Príncipe Real', 60, ['shopping', 'architecture'], 'A former palace turned arcade of small design shops.', { indoor: true, energy: 1 }),
    lPrincipe('lunch', 'Mercado de Campo de Ourique', 'Campo de Ourique', 75, ['food'], 'A neighbourhood food market that locals still use.', { tourist: 1 }),
    lPrincipe('afternoon', 'Museu Calouste Gulbenkian', 'Avenidas Novas', 150, ['galleries', 'architecture'], 'A large art collection in a modernist building with gardens.', { indoor: true, energy: 1 }),
    lPrincipe('afternoon', 'Príncipe Real gallery walk', 'Príncipe Real', 90, ['galleries', 'shopping', 'architecture'], 'Independent galleries and showrooms within a few streets.', { indoor: true, tourist: 0 }),
    lPrincipe('sunset', 'Miradouro de Santa Catarina', 'Santa Catarina', 60, ['views'], 'A terrace with musicians and a view of the river.', { tourist: 2, energy: 1 }),
    lPrincipe('dinner', 'A Cevicheria', 'Príncipe Real', 90, ['food'], 'Peruvian-influenced seafood in a lively room.', { tourist: 2 }),
    lPrincipe('evening', 'Bairro Alto bars', 'Bairro Alto', 90, ['nightlife'], 'Small bars that spill out onto the street.', { tourist: 2 }),

    lBeach('coffee', 'Coffee in Cascais old town', 'Cascais', 40, ['cafes'], 'A slow start after the train from Cais do Sodré.', { tourist: 1 }),
    lBeach('morning', 'Cascais old town and harbour', 'Cascais', 90, ['views', 'history'], 'Whitewashed lanes and the fishing harbour.', { tourist: 1, energy: 1 }),
    lBeach('lunch', 'Grilled fish lunch in Cascais', 'Cascais', 90, ['food'], 'Simple fish and salads a few streets from the beach.', { tourist: 1 }),
    lBeach('afternoon', 'Praia da Conceição', 'Cascais', 180, ['beach'], 'A sheltered town beach, walkable from the station.', { tourist: 1, energy: 1 }),
    lBeach('afternoon', 'Praia do Guincho', 'Guincho', 180, ['beach', 'nature'], 'A wide, windy Atlantic beach with dunes behind it.', { tourist: 0, energy: 2 }),
    lBeach('afternoon2', 'Boca do Inferno', 'Cascais', 45, ['nature', 'views'], 'Sea cliffs and a rock arch, a short walk from the centre.', { tourist: 2, energy: 1 }),
    lBeach('sunset', 'Seafront path toward Estoril', 'Cascais', 60, ['views', 'nature'], 'A flat coastal walk with the sun going down over the water.', { tourist: 1, energy: 1 }),
    lBeach('dinner', 'Seafood dinner in Cascais', 'Cascais', 90, ['food'], 'Shellfish and grilled fish before the last train back.', { tourist: 1 }),
  ],
}

// ---------------------------------------------------------------- TOKYO
const tOld = maker('old-tokyo')
const tShibuya = maker('shibuya')
const tShinjuku = maker('shinjuku')
const tGinza = maker('ginza')
const tKamakura = maker('kamakura')

const tokyo: Destination = {
  id: 'tokyo',
  name: 'Tokyo',
  country: 'Japan',
  tagline: 'Temples, ramen counters and neon after dark.',
  palette: { sky: '#d3dfe9', sun: '#d9563b', far: '#8aa4c0', mid: '#3d5b86', near: '#14233f', accent: '#faf3e4' },
  zones: [
    { id: 'old-tokyo', title: 'Old Tokyo', blurb: 'Temples, museums and river views in Asakusa and Ueno.', iconic: true },
    { id: 'shibuya', title: 'Shibuya and Omotesando', blurb: 'Shrine woods, architecture and the busiest crossing on earth.' },
    { id: 'shinjuku', title: 'Shinjuku', blurb: 'Gardens by day, alleys and bars by night.' },
    { id: 'ginza', title: 'Ginza and the waterfront', blurb: 'Markets, galleries and the bay.' },
    { id: 'kamakura', title: 'Kamakura day trip', blurb: 'An hour south by train: temples, a great Buddha and a beach.', optional: ['beach', 'nature', 'history'] },
  ],
  activities: [
    tOld('coffee', 'Kissaten coffee in Asakusa', 'Asakusa', 40, ['cafes', 'history'], 'An old-style coffee house with thick toast.', { tourist: 1 }),
    tOld('morning', 'Senso-ji', 'Asakusa', 90, ['history', 'architecture'], 'Tokyo\u2019s oldest temple, best before the shops open.', { tourist: 3, energy: 1 }),
    tOld('lunch', 'Tempura lunch in Asakusa', 'Asakusa', 60, ['food'], 'A counter that serves one thing and does it well.', { tourist: 1 }),
    tOld('afternoon', 'Tokyo National Museum', 'Ueno', 150, ['galleries', 'history'], 'Japan\u2019s largest collection of art and antiquities.', { indoor: true, energy: 1 }),
    tOld('afternoon', 'Kappabashi Street', 'Asakusa', 75, ['shopping'], 'A whole street of kitchen knives, ceramics and plastic food.', { indoor: true, tourist: 1, energy: 1 }),
    tOld('afternoon2', 'Ueno Park', 'Ueno', 60, ['nature'], 'Ponds, pavilions and shaded paths in the middle of the city.', { tourist: 1, energy: 1 }),
    tOld('sunset', 'Sumida River walk', 'Asakusa', 60, ['views', 'architecture'], 'A riverside path with the Skytree overhead.', { tourist: 1, energy: 1 }),
    tOld('sunset', 'Tokyo Skytree', 'Sumida', 75, ['views', 'architecture'], 'A high observation deck for the last light.', { indoor: true, tourist: 3, energy: 1 }),
    tOld('dinner', 'Izakaya dinner in Ueno', 'Ueno', 90, ['food', 'nightlife'], 'Small plates and cold beer under the railway arches.', { tourist: 1 }),
    tOld('evening', 'Hoppy Street', 'Asakusa', 75, ['nightlife'], 'A lane of open-fronted bars serving the local highball.', { tourist: 2 }),

    tShibuya('coffee', 'Coffee stand on Omotesando', 'Omotesando', 35, ['cafes', 'architecture'], 'A quick coffee on the tree-lined avenue.', { tourist: 1 }),
    tShibuya('morning', 'Meiji Jingu', 'Harajuku', 90, ['nature', 'history'], 'A forest shrine with a long gravel approach.', { tourist: 2, energy: 1 }),
    tShibuya('lunch', 'Ramen lunch in Shibuya', 'Shibuya', 50, ['food'], 'A ticket-machine counter with a short menu.', { tourist: 1 }),
    tShibuya('afternoon', 'Nezu Museum', 'Aoyama', 120, ['galleries', 'architecture'], 'Japanese and East Asian art in a Kengo Kuma building with a garden.', { indoor: true, energy: 1 }),
    tShibuya('afternoon', 'Omotesando architecture walk', 'Omotesando', 90, ['architecture', 'shopping'], 'Flagship buildings by Ando, Ito and Herzog and de Meuron on one avenue.', { tourist: 1, energy: 1 }),
    tShibuya('afternoon2', 'Harajuku backstreets', 'Harajuku', 75, ['shopping'], 'Vintage shops and small labels behind Takeshita Street.', { tourist: 1 }),
    tShibuya('sunset', 'Shibuya Sky', 'Shibuya', 60, ['views'], 'A rooftop deck over the crossing at golden hour.', { tourist: 3, energy: 1 }),
    tShibuya('dinner', 'Yakitori dinner in Ebisu', 'Ebisu', 90, ['food'], 'Grilled skewers at a counter full of locals.', { tourist: 1 }),
    tShibuya('evening', 'Nonbei Yokocho', 'Shibuya', 75, ['nightlife'], 'A wooden alley of tiny bars beside the tracks.', { tourist: 2 }),

    tShinjuku('coffee', 'Kissaten near Shinjuku Station', 'Shinjuku', 40, ['cafes'], 'A dim, old-fashioned coffee house near the station.', { tourist: 0 }),
    tShinjuku('morning', 'Shinjuku Gyoen', 'Shinjuku', 120, ['nature'], 'A large garden with lawns, glasshouses and a tea house.', { tourist: 1, energy: 1 }),
    tShinjuku('lunch', 'Tonkatsu lunch in Shinjuku', 'Shinjuku', 60, ['food'], 'Breaded pork cutlet with unlimited cabbage.', { tourist: 1 }),
    tShinjuku('afternoon', 'Tokyo Metropolitan Government Building', 'Shinjuku', 60, ['views', 'architecture'], 'A Kenzo Tange tower with a free observation deck.', { indoor: true, tourist: 2, energy: 1 }),
    tShinjuku('afternoon', 'Nakano Broadway', 'Nakano', 120, ['shopping'], 'A four-storey mall of manga, vintage toys and collectibles.', { indoor: true, tourist: 1 }),
    tShinjuku('afternoon2', 'Omoide Yokocho', 'Shinjuku', 60, ['food', 'nightlife'], 'Smoky alleys of yakitori stalls.', { tourist: 2 }),
    tShinjuku('dinner', 'Izakaya dinner in Shinjuku', 'Shinjuku', 90, ['food'], 'A basement izakaya with a long, handwritten menu.', { tourist: 1 }),
    tShinjuku('evening', 'Golden Gai', 'Shinjuku', 90, ['nightlife'], 'Six alleys of bars that seat six people each.', { tourist: 2 }),

    tGinza('coffee', 'Kissaten in Ginza', 'Ginza', 40, ['cafes', 'history'], 'A quiet coffee house that has been pouring by hand for decades.', { tourist: 1 }),
    tGinza('morning', 'Tsukiji Outer Market', 'Tsukiji', 90, ['food'], 'Stalls of tamago, seafood and pickles. Go early.', { tourist: 2 }),
    tGinza('lunch', 'Sushi counter near Tsukiji', 'Tsukiji', 60, ['food'], 'A small counter with a fixed set.', { tourist: 2 }),
    tGinza('afternoon', 'Ginza gallery walk', 'Ginza', 100, ['galleries', 'shopping'], 'Small free galleries hidden in office and department store floors.', { indoor: true, tourist: 0, energy: 1 }),
    tGinza('afternoon', 'Hamarikyu Gardens', 'Shiodome', 75, ['nature', 'views'], 'A tidal garden with a tea house against a glass skyline.', { tourist: 1, energy: 1 }),
    tGinza('afternoon2', 'teamLab Planets', 'Toyosu', 100, ['galleries'], 'Walk-through digital art, mostly barefoot.', { indoor: true, tourist: 3 }),
    tGinza('sunset', 'Odaiba waterfront', 'Odaiba', 60, ['views'], 'Bay views back across to the skyline.', { tourist: 2, energy: 1 }),
    tGinza('dinner', 'Sushi dinner in Ginza', 'Ginza', 100, ['food'], 'An omakase counter for the one big meal of the trip.', { tourist: 1 }),
    tGinza('evening', 'Cocktail bar in Ginza', 'Ginza', 75, ['nightlife'], 'A hushed bar with a bartender in a white jacket.', { tourist: 0 }),

    tKamakura('coffee', 'Coffee near Kamakura Station', 'Kamakura', 40, ['cafes'], 'A small café before the sightseeing loop.', { tourist: 1 }),
    tKamakura('morning', 'Kotoku-in (Great Buddha)', 'Kamakura', 60, ['history', 'architecture'], 'A thirteenth-century bronze Buddha, outdoors.', { tourist: 3, energy: 1 }),
    tKamakura('lunch', 'Shirasu bowl lunch', 'Kamakura', 60, ['food'], 'Local whitebait over rice.', { tourist: 1 }),
    tKamakura('afternoon', 'Hase-dera', 'Kamakura', 90, ['history', 'nature'], 'A hillside temple with gardens and a sea view.', { tourist: 2 }),
    tKamakura('afternoon2', 'Yuigahama Beach', 'Kamakura', 90, ['beach'], 'A long, easy beach for a paddle and a rest.', { tourist: 1, energy: 1 }),
    tKamakura('sunset', 'Enoshima', 'Enoshima', 75, ['views', 'nature'], 'A small island with a lighthouse and sunset over Fuji on clear days.', { tourist: 2 }),
    tKamakura('dinner', 'Dinner in Kamakura', 'Kamakura', 90, ['food'], 'A quiet place near the station before the train back.', { tourist: 1 }),
  ],
}

// ---------------------------------------------------------------- NEW YORK
const nDown = maker('downtown')
const nMid = maker('midtown')
const nVillage = maker('village')
const nPark = maker('park')

const newYork: Destination = {
  id: 'new-york',
  name: 'New York',
  country: 'United States',
  tagline: 'Big museums, small restaurants and a lot of walking.',
  palette: { sky: '#e9d9bf', sun: '#e0a24f', far: '#8aa4c0', mid: '#3d5b86', near: '#14233f', accent: '#faf3e4' },
  zones: [
    { id: 'downtown', title: 'Lower Manhattan and Brooklyn', blurb: 'The bridge, the harbour and the Lower East Side.', iconic: true },
    { id: 'midtown', title: 'Midtown', blurb: 'The big buildings and the big museum.' },
    { id: 'village', title: 'West Village and Chelsea', blurb: 'Galleries, a park on an old railway and small streets.' },
    { id: 'park', title: 'Central Park and Uptown', blurb: 'Lawns, lakes and two of the world\u2019s best museums.' },
  ],
  activities: [
    nDown('coffee', 'Coffee in Tribeca', 'Tribeca', 35, ['cafes'], 'A quick coffee in a converted warehouse.', { tourist: 0 }),
    nDown('morning', 'Brooklyn Bridge walk', 'Brooklyn Bridge', 90, ['architecture', 'views', 'history'], 'Walk across toward Brooklyn with the skyline behind you.', { tourist: 3, energy: 2 }),
    nDown('lunch', 'Lunch in Dumbo', 'Dumbo', 75, ['food'], 'Cobbled streets and a table with a bridge view.', { tourist: 2 }),
    nDown('afternoon', 'Tenement Museum', 'Lower East Side', 90, ['history'], 'A guided visit to restored immigrant apartments.', { indoor: true, tourist: 1, energy: 1 }),
    nDown('afternoon', 'Oculus and the 9/11 Memorial', 'Financial District', 100, ['architecture', 'history'], 'A Calatrava station hall beside the memorial pools.', { tourist: 3, energy: 1 }),
    nDown('afternoon2', 'Chinatown and Little Italy', 'Lower Manhattan', 75, ['food', 'shopping'], 'Bakeries, tea shops and dumpling counters within a few blocks.', { tourist: 2 }),
    nDown('sunset', 'Brooklyn Bridge Park', 'Brooklyn Heights', 60, ['views', 'nature'], 'The piers below the bridge, with the skyline lit up.', { tourist: 2, energy: 1 }),
    nDown('dinner', 'Dinner on the Lower East Side', 'Lower East Side', 90, ['food'], 'Small restaurants on Orchard and Ludlow streets.', { tourist: 1 }),
    nDown('evening', 'Bar in the East Village', 'East Village', 90, ['nightlife'], 'A low-lit bar with no sign outside.', { tourist: 1 }),

    nMid('coffee', 'Coffee near Grand Central', 'Midtown East', 30, ['cafes'], 'A quick coffee before the terminal.', { tourist: 1 }),
    nMid('morning', 'Grand Central Terminal', 'Midtown East', 60, ['architecture', 'history'], 'A Beaux-Arts hall with a painted ceiling of stars.', { indoor: true, tourist: 3, energy: 1 }),
    nMid('lunch', 'Lunch by Bryant Park', 'Midtown', 60, ['food'], 'A sandwich on a green chair outside the library.', { tourist: 1 }),
    nMid('afternoon', 'MoMA', 'Midtown', 150, ['galleries', 'architecture'], 'Modern art from Van Gogh to now.', { indoor: true, tourist: 3, energy: 1 }),
    nMid('afternoon', 'New York Public Library', 'Midtown', 60, ['architecture', 'history'], 'The main reading room, with lions at the door.', { indoor: true, tourist: 2, energy: 1 }),
    nMid('afternoon2', 'Rockefeller Center', 'Midtown', 45, ['architecture'], 'Art deco towers around a sunken plaza.', { tourist: 3, energy: 1 }),
    nMid('sunset', 'Top of the Rock', 'Midtown', 60, ['views', 'architecture'], 'A view of the Empire State Building at dusk.', { tourist: 3, energy: 1 }),
    nMid('dinner', 'Dinner in Hell\u2019s Kitchen', 'Hell\u2019s Kitchen', 90, ['food'], 'Ninth Avenue is lined with small, good restaurants.', { tourist: 1 }),
    nMid('evening', 'A Broadway show', 'Theater District', 150, ['nightlife'], 'An evening at the theatre.', { indoor: true, tourist: 3, energy: 1 }),

    nVillage('coffee', 'Coffee in the West Village', 'West Village', 35, ['cafes'], 'A corner café on a tree-lined street.', { tourist: 0 }),
    nVillage('morning', 'The High Line', 'Chelsea', 90, ['architecture', 'nature', 'views'], 'A park built on an old freight railway.', { tourist: 2, energy: 1 }),
    nVillage('lunch', 'Chelsea Market', 'Chelsea', 75, ['food'], 'A food hall inside an old biscuit factory.', { tourist: 3 }),
    nVillage('afternoon', 'Whitney Museum', 'Meatpacking District', 120, ['galleries', 'architecture'], 'American art in a Renzo Piano building with terraces.', { indoor: true, tourist: 2, energy: 1 }),
    nVillage('afternoon', 'Chelsea gallery hop', 'Chelsea', 100, ['galleries'], 'Free galleries along West 20th to 26th streets.', { indoor: true, tourist: 0, energy: 1 }),
    nVillage('afternoon2', 'Little Island', 'Hudson River Park', 60, ['architecture', 'nature'], 'A park on concrete tulip-shaped piers over the river.', { tourist: 2, energy: 1 }),
    nVillage('sunset', 'Hudson River Park piers', 'West Village', 60, ['views'], 'A pier for watching the sun go down over New Jersey.', { tourist: 1, energy: 1 }),
    nVillage('dinner', 'West Village dinner', 'West Village', 90, ['food'], 'A small room on a quiet, crooked street.', { tourist: 1 }),
    nVillage('evening', 'Village Vanguard', 'West Village', 90, ['nightlife', 'history'], 'A basement jazz club running since 1935.', { tourist: 2 }),

    nPark('coffee', 'Coffee on the Upper West Side', 'Upper West Side', 35, ['cafes'], 'A quick coffee before the park.', { tourist: 0 }),
    nPark('morning', 'Central Park walk', 'Central Park', 120, ['nature', 'views'], 'The Ramble, Bethesda Terrace and the lake.', { tourist: 2, energy: 2 }),
    nPark('lunch', 'Bagels near the park', 'Upper West Side', 45, ['food'], 'A counter that sells bagels by the dozen.', { tourist: 1 }),
    nPark('afternoon', 'The Met', 'Upper East Side', 180, ['galleries', 'history'], 'Too big to see in a day, so pick two wings.', { indoor: true, tourist: 3, energy: 2 }),
    nPark('afternoon', 'Guggenheim Museum', 'Upper East Side', 100, ['architecture', 'galleries'], 'Frank Lloyd Wright\u2019s spiral, with modern art on the ramp.', { indoor: true, tourist: 2, energy: 1 }),
    nPark('afternoon2', 'Conservatory Garden', 'Central Park', 45, ['nature'], 'A formal garden at the top of the park.', { tourist: 0, energy: 1 }),
    nPark('sunset', 'The Reservoir', 'Central Park', 60, ['views', 'nature'], 'The city skyline reflected in still water.', { tourist: 1, energy: 1 }),
    nPark('dinner', 'Dinner on the Upper West Side', 'Upper West Side', 90, ['food'], 'A neighbourhood restaurant with a full room.', { tourist: 0 }),
    nPark('evening', 'Dizzy\u2019s Club', 'Columbus Circle', 90, ['nightlife'], 'Jazz with a view of the park.', { tourist: 2 }),
  ],
}

// ---------------------------------------------------------------- CAPE TOWN
const cBowl = maker('city-bowl')
const cMountain = maker('mountain')
const cAtlantic = maker('atlantic')
const cPeninsula = maker('peninsula')

const capeTown: Destination = {
  id: 'cape-town',
  name: 'Cape Town',
  country: 'South Africa',
  tagline: 'A mountain in the middle of the city, and two oceans.',
  palette: { sky: '#cfdcd9', sun: '#e6a15a', far: '#8aa4c0', mid: '#3c6a78', near: '#14233f', accent: '#faf3e4' },
  zones: [
    { id: 'city-bowl', title: 'City Bowl and Bo-Kaap', blurb: 'Coloured houses, a new art museum and the waterfront.', iconic: true },
    { id: 'mountain', title: 'Mountain and vineyards', blurb: 'Table Mountain, a botanical garden and a wine estate.' },
    { id: 'atlantic', title: 'Atlantic seaboard', blurb: 'Sea Point to Camps Bay: beaches, promenades and sundowners.', optional: ['beach'] },
    { id: 'peninsula', title: 'Cape Peninsula', blurb: 'A long day south: penguins, cliffs and fishing harbours.', optional: ['nature', 'views', 'beach'] },
  ],
  activities: [
    cBowl('coffee', 'Origin Coffee Roasting', 'City Bowl', 40, ['cafes'], 'A roaster on Roeland Street, busy with regulars.', { tourist: 1 }),
    cBowl('morning', 'Bo-Kaap walk', 'Bo-Kaap', 90, ['architecture', 'history'], 'Brightly painted houses on cobbled streets.', { tourist: 2, energy: 1 }),
    cBowl('lunch', 'Cape Malay lunch in Bo-Kaap', 'Bo-Kaap', 75, ['food', 'history'], 'Curries and koeksisters from a long local tradition.', { tourist: 1 }),
    cBowl('afternoon', 'Zeitz MOCAA', 'V&A Waterfront', 120, ['galleries', 'architecture'], 'Contemporary African art in a converted grain silo.', { indoor: true, tourist: 2, energy: 1 }),
    cBowl('afternoon', 'Iziko South African Museum', 'City Bowl', 90, ['history'], 'Natural history and rock art beside the gardens.', { indoor: true, tourist: 1, energy: 1 }),
    cBowl('afternoon2', 'The Company\u2019s Garden', 'City Bowl', 60, ['nature', 'history'], 'The oldest garden in the country, in the middle of town.', { tourist: 1, energy: 1 }),
    cBowl('sunset', 'Signal Hill', 'Signal Hill', 60, ['views'], 'A road up the hill for the city and Table Bay at dusk.', { tourist: 2, energy: 1 }),
    cBowl('dinner', 'Dinner on Bree Street', 'Bree Street', 90, ['food'], 'A short strip of small restaurants and wine bars.', { tourist: 1 }),
    cBowl('evening', 'Bar on Long Street', 'Long Street', 90, ['nightlife'], 'Victorian balconies and late-night bars.', { tourist: 2 }),

    cMountain('coffee', 'Coffee on Kloof Street', 'Gardens', 40, ['cafes'], 'A relaxed start below the mountain.', { tourist: 0 }),
    cMountain('morning', 'Table Mountain cable car', 'Table Mountain', 150, ['nature', 'views'], 'The cable car and a walk on the flat top. Weather dependent.', { tourist: 3, energy: 2 }),
    cMountain('lunch', 'Lunch at Kirstenbosch', 'Newlands', 75, ['food', 'nature'], 'A table in the garden at the foot of the mountain.', { tourist: 1 }),
    cMountain('afternoon', 'Kirstenbosch Botanical Garden', 'Newlands', 150, ['nature'], 'Indigenous plants and a treetop walkway.', { tourist: 2, energy: 1 }),
    cMountain('afternoon2', 'Constantia wine estate', 'Constantia', 120, ['food', 'nature'], 'A tasting on an estate with vineyards up the slope.', { tourist: 2, energy: 1 }),
    cMountain('dinner', 'Dinner in Gardens', 'Gardens', 90, ['food'], 'A neighbourhood restaurant close to where you are staying.', { tourist: 0 }),

    cAtlantic('coffee', 'Coffee in Sea Point', 'Sea Point', 35, ['cafes'], 'A café a few minutes from the water.', { tourist: 0 }),
    cAtlantic('morning', 'Sea Point Promenade', 'Sea Point', 90, ['nature', 'views'], 'A flat seafront walk that locals use daily.', { tourist: 1, energy: 1 }),
    cAtlantic('lunch', 'Seafood lunch in Camps Bay', 'Camps Bay', 90, ['food'], 'A terrace across the road from the beach.', { tourist: 2 }),
    cAtlantic('afternoon', 'Clifton beaches', 'Clifton', 180, ['beach'], 'Four sheltered beaches below the road.', { tourist: 2, energy: 1 }),
    cAtlantic('afternoon', 'Camps Bay beach', 'Camps Bay', 150, ['beach'], 'A wide beach with the mountain behind it.', { tourist: 3, energy: 1 }),
    cAtlantic('afternoon2', 'Chapman\u2019s Peak Drive', 'Hout Bay', 90, ['views', 'nature'], 'A coastal road cut into the cliffs.', { tourist: 2, energy: 1 }),
    cAtlantic('sunset', 'Sundowners in Camps Bay', 'Camps Bay', 75, ['views', 'beach'], 'A drink on a terrace while the sun sets over the Atlantic.', { tourist: 2, energy: 1 }),
    cAtlantic('dinner', 'Dinner in Camps Bay', 'Camps Bay', 90, ['food'], 'A restaurant along the strip, with an ocean view.', { tourist: 2 }),

    cPeninsula('coffee', 'Coffee in Kalk Bay', 'Kalk Bay', 40, ['cafes'], 'A café above the harbour.', { tourist: 1 }),
    cPeninsula('morning', 'Boulders Beach penguins', 'Simon\u2019s Town', 90, ['nature'], 'A colony of African penguins on a sheltered beach.', { tourist: 3, energy: 1 }),
    cPeninsula('lunch', 'Fish and chips in Kalk Bay', 'Kalk Bay', 75, ['food'], 'A harbour counter with the fishing boats in view.', { tourist: 2 }),
    cPeninsula('afternoon', 'Cape of Good Hope', 'Cape Point', 150, ['nature', 'views'], 'Cliffs, fynbos and a lighthouse at the tip of the peninsula.', { tourist: 3, energy: 2 }),
    cPeninsula('afternoon', 'Kalk Bay shops', 'Kalk Bay', 90, ['shopping'], 'Antiques, books and small galleries on the main road.', { indoor: true, tourist: 1, energy: 1 }),
    cPeninsula('sunset', 'Kalk Bay harbour', 'Kalk Bay', 60, ['views'], 'Boats coming in as the light goes.', { tourist: 1, energy: 1 }),
    cPeninsula('dinner', 'Dinner in Simon\u2019s Town', 'Simon\u2019s Town', 90, ['food'], 'A seafood restaurant on the naval harbour.', { tourist: 1 }),
  ],
}

export const DESTINATIONS: Destination[] = [lisbon, tokyo, newYork, capeTown]

const GENERIC_PALETTES: Palette[] = [
  { sky: '#d9e2df', sun: '#e59a5a', far: '#8da6a0', mid: '#4d6b68', near: '#183b3b', accent: '#f7f0df' },
  { sky: '#dce2ed', sun: '#d47b5c', far: '#8c9db8', mid: '#4b6284', near: '#1b2942', accent: '#faf1df' },
  { sky: '#eadfcf', sun: '#d98d4b', far: '#9a9a83', mid: '#5c6550', near: '#29352b', accent: '#fbf5e8' },
]

const genericPalette = (name: string): Palette => {
  const hash = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return GENERIC_PALETTES[hash % GENERIC_PALETTES.length]
}

/**
 * Planning scaffold for destinations without curated venue data.
 * It uses planning actions rather than inventing real places. This layer can
 * later be replaced by location/AI data without changing the itinerary engine.
 */
export const createDestination = (name: string): Destination => {
  const cleanName = name.trim().replace(/\\s+/g, ' ')
  const id = slug(cleanName)
  const make = (zone: string) => maker(zone)

  return {
    id,
    name: cleanName,
    country: '',
    tagline: 'A flexible starting point for planning your days.',
    palette: genericPalette(cleanName),
    zones: [
      { id: 'centre', title: 'The centre', blurb: 'Start with the main streets, landmarks and neighbourhoods closest to the heart of the city.', iconic: true },
      { id: 'culture', title: 'Culture and character', blurb: 'Leave room for museums, galleries, historic places and the parts of the city with a story.' },
      { id: 'food', title: 'Food and local life', blurb: 'Build around markets, cafés, local restaurants and the neighbourhoods where people actually spend time.', optional: ['food', 'cafes', 'shopping'] },
      { id: 'outdoors', title: 'Outdoors and views', blurb: 'A flexible day for parks, walks, waterfronts, viewpoints or another way to get outside.', optional: ['nature', 'views', 'beach'] },
      { id: 'neighbourhoods', title: 'Neighbourhoods', blurb: 'A slower day for wandering, shopping, cafés and seeing how the city changes from one area to another.' },
    ],
    activities: [
      make('centre')('coffee', 'Start with a café near where you are staying', 'Nearby', 45, ['cafes'], 'A practical first stop. Choose somewhere close rather than crossing the city first.'),
      make('centre')('morning', 'Explore the central district', 'City centre', 120, ['architecture', 'history', 'views'], 'A flexible walking block for the places that make the city feel like itself.', { tourist: 1, energy: 2 }),
      make('centre')('lunch', 'Find a local lunch spot', 'City centre', 75, ['food'], 'Keep lunch close to the morning route and choose a place that fits your preferences.', { tourist: 1 }),
      make('centre')('afternoon', 'See one major landmark or museum', 'City centre', 120, ['architecture', 'history', 'galleries'], 'Pick one substantial stop rather than trying to cover every attraction.', { indoor: true, energy: 1 }),
      make('centre')('sunset', 'Find a good viewpoint nearby', 'City centre', 60, ['views'], 'Use the end of the day for a viewpoint, waterfront or another good place to pause.', { tourist: 1, energy: 1 }),
      make('centre')('dinner', 'Dinner in the neighbourhood', 'City centre', 90, ['food'], 'Choose somewhere nearby so dinner does not turn into another commute.', { tourist: 1 }),

      make('culture')('coffee', 'Coffee before the day starts', 'Culture district', 40, ['cafes'], 'An easy start near the first cultural stop.'),
      make('culture')('morning', 'Visit a museum, gallery or historic site', 'Culture district', 120, ['galleries', 'history', 'architecture'], 'Choose the cultural stop that best matches what you want to learn or see.', { indoor: true, energy: 1 }),
      make('culture')('lunch', 'Lunch nearby', 'Culture district', 75, ['food'], 'Stay in the area for lunch rather than doubling back.', { tourist: 1 }),
      make('culture')('afternoon', 'Explore the surrounding neighbourhood', 'Culture district', 100, ['architecture', 'shopping', 'history'], 'Walk beyond the headline attraction and see what is around it.', { tourist: 0, energy: 1 }),
      make('culture')('afternoon2', 'A second cultural stop', 'Culture district', 90, ['galleries', 'history'], 'Optional if you still have the energy for another focused stop.', { indoor: true, energy: 1 }),
      make('culture')('dinner', 'Dinner somewhere local', 'Culture district', 90, ['food'], 'Keep the evening close to where the day finishes.', { tourist: 1 }),

      make('food')('coffee', 'Start at a local café or bakery', 'Food neighbourhood', 45, ['cafes', 'food'], 'Give the morning a food-first start.'),
      make('food')('morning', 'Explore a market or food neighbourhood', 'Food neighbourhood', 100, ['food', 'shopping'], 'Browse local food, shops and everyday street life.', { tourist: 1, energy: 1 }),
      make('food')('lunch', 'Make lunch the main event', 'Food neighbourhood', 90, ['food'], 'Leave enough time to actually enjoy the meal rather than fitting it between attractions.', { tourist: 1 }),
      make('food')('afternoon', 'Wander the surrounding neighbourhoods', 'Food neighbourhood', 90, ['shopping', 'architecture', 'cafes'], 'Walk off lunch through nearby streets, shops and cafés.', { tourist: 0, energy: 1 }),
      make('food')('sunset', 'Find somewhere good for golden hour', 'Nearby', 60, ['views'], 'A simple end-of-day pause before dinner.', { tourist: 1 }),
      make('food')('dinner', 'Choose a local dinner spot', 'Food neighbourhood', 100, ['food', 'nightlife'], 'Keep the evening centred on food rather than another sightseeing checklist.', { tourist: 1 }),

      make('outdoors')('coffee', 'Coffee before heading outside', 'Nearby', 40, ['cafes'], 'A simple start before a longer walk.'),
      make('outdoors')('morning', 'Take a long walk outdoors', 'Outdoors', 120, ['nature', 'views'], 'Use whatever the city offers: a park, waterfront, trail or open space.', { tourist: 0, energy: 2 }),
      make('outdoors')('lunch', 'Lunch near the route', 'Outdoors', 75, ['food'], 'Stop somewhere convenient instead of travelling across town.', { tourist: 1 }),
      make('outdoors')('afternoon', 'Spend time in a park or open space', 'Outdoors', 120, ['nature', 'beach', 'views'], 'Leave the afternoon open enough to slow down or stay longer if it is good.', { tourist: 1, energy: 1 }),
      make('outdoors')('sunset', 'Watch the light from a good viewpoint', 'Outdoors', 75, ['views', 'nature'], 'Use the final light rather than squeezing in another attraction.', { tourist: 1, energy: 1 }),
      make('outdoors')('dinner', 'Dinner near where you finish', 'Nearby', 90, ['food'], 'End the day without another long journey.', { tourist: 1 }),

      make('neighbourhoods')('coffee', 'A slow café morning', 'Local neighbourhood', 60, ['cafes'], 'Start slowly and choose somewhere you would happily sit for a while.'),
      make('neighbourhoods')('morning', 'Pick a neighbourhood and wander', 'Local neighbourhood', 120, ['architecture', 'history', 'shopping'], 'Follow the streets that look interesting rather than a strict checklist.', { tourist: 0, energy: 1 }),
      make('neighbourhoods')('lunch', 'Eat where locals eat', 'Local neighbourhood', 75, ['food'], 'Keep lunch informal and close to the neighbourhood you are exploring.', { tourist: 0 }),
      make('neighbourhoods')('afternoon', 'Browse shops, galleries or cafés', 'Local neighbourhood', 100, ['shopping', 'galleries', 'cafes'], 'A flexible block for whatever catches your attention.', { tourist: 0, energy: 1 }),
      make('neighbourhoods')('sunset', 'Leave the afternoon open', 'Nearby', 60, ['views'], 'A little unplanned time is part of the day.', { tourist: 0, energy: 1 }),
      make('neighbourhoods')('dinner', 'Dinner close to your base', 'Local neighbourhood', 90, ['food'], 'Finish somewhere convenient and easy.', { tourist: 0 }),
    ],
  }
}

const GENERIC_CACHE = new Map<string, Destination>()

export const getDestination = (id: DestinationId): Destination => {
  const known = DESTINATIONS.find((d) => d.id === id)
  if (known) return known
  const key = slug(id)
  const cached = GENERIC_CACHE.get(key)
  if (cached) return cached
  const destination = createDestination(id)
  GENERIC_CACHE.set(key, destination)
  return destination
}
