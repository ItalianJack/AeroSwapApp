const {v4: uuidv4} = require('uuid');

let aircraft = [
    {
        id: uuidv4(),
        title: 'Airtrike Ultralight',
        seller: 'Norm Niner',
        condition: 'used-no-overhaul',
        price: 8999.99,
        details: 'Very good condition Airtrike Ultralight, never been overhauled. Blue. Lycoming OH-972. 2007 model.',
        image: 'ultralight_discover-hubpages_fullsize.jpg',
        totalOffers: 0,
        active: true
    },
    {
        id: uuidv4(),
        title: 'Piper Light Sport',
        seller: 'George Adams',
        condition: 'used-no-overhaul',
        price: 18999.99,
        details: 'Very good condition Piper Light Sport, never been overhauled. Blue. Lycoming OH-972. 2007 model.',
        image: 'piper_sport_aiteam-org_fullsize.jpg',
        totalOffers: 0,
        active: true
    },
    {
        id: uuidv4(),
        title: 'Cessna 150',
        seller: 'Emily White',
        condition: 'used-no-overhaul',
        price: 25999.99,
        details: 'Very good condition Cessna 150, never been overhauled. Blue. Lycoming OH-972. 2007 model.',
        image: 'cessna-150_airliners-net_fullsize.jpg',
        totalOffers: 0,
        active: true
    },
    {
        id: uuidv4(),
        title: 'Cessna 172 (Cert. IFR)',
        seller: 'Chris Rodriguez',
        condition: 'used-no-overhaul',
        price: 79999.99,
        details: 'Very good condition Cessna 172, never been overhauled. Blue. Lycoming OH-972. 2007 model.',
        image: 'cessna_172s_commons-wikimedia-org_fullsize.jpg',
        totalOffers: 0,
        active: true
    },
    {
        id: uuidv4(),
        title: 'Cirrus SR-22',
        seller: 'Blair Smith',
        condition: 'used-no-overhaul',
        price: 109999.99,
        details: 'Very good condition Cirrus SR-22, never been overhauled. Blue. Lycoming OH-972. 2007 model.',
        image: 'cirrus_sr-22_wikipedia_fullsize.jpg',
        totalOffers: 0,
        active: true
    },
    {
        id: uuidv4(),
        title: 'Cirrus Vision',
        seller: 'Adam Jones',
        condition: 'used-no-overhaul',
        price: 599999.99,
        details: 'Very good condition Cirrus Vision SF-50, never been overhauled. Blue. Lycoming OH-972. 2007 model.',
        image: 'cirrus_vision_sf50_wikipedia_fullsize.jpg',
        totalOffers: 0,
        active: true
    },
]

console.log(aircraft);