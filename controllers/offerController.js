const Aircraft = require('../models/aircraft');
const Offer = require('../models/offer');

// List - GET /aircraft/:id/offers
exports.list = (req, res, next) => {
    const acId = req.params.id;
    Offer.find({aircraft: acId}).populate('buyer')
        .then(offers => {
            Aircraft.findById(acId)
                .then(aircraft => {
                    res.render('aircraft/offers', {offers, aircraft});
                });
        })
        .catch(err => {
            next(err);
        });
}

// Create - POST /aircraft/:id/offers
exports.create = (req, res, next) => {
    const acId = req.params.id;
    let offer = new Offer(req.body);
    offer.aircraft = acId;
    offer.buyer = req.session.user._id;
    offer.save()
        .then((savedOffer) => {
            // Tell the user that the offer was created
            req.flash('success', 'Offer created successfully.');
            res.redirect(`/aircraft/${acId}`);
            // Update the aircraft's offer count and highest offer if necessary
            Aircraft.findById(acId)
                .then(aircraft => {
                    aircraft.totalOffers++;
                    if (savedOffer.price > aircraft.highestOffer) {
                        aircraft.highestOffer = savedOffer.price;
                    }
                    aircraft.save();
                })
        })
        .catch(err => {
            next(err);
        });
}

// Accept - PUT? /aircraft/:id/offers/:offerId/accept
// Accept an offer and reject all other offers
exports.accept = (req, res, next) => {
    const acId = req.params.id;
    const offerId = req.params.offerId;

    // Set the aircraft listing to inactive
    Aircraft.findById(acId)
        .then(aircraft => {
            aircraft.active = false;
            aircraft.save();
        })
        // Find the offer by ID and accept it
        .then(() => {
            Offer.findById(offerId)
                .then(acceptedOffer => {
                    acceptedOffer.accepted = "Accepted";
                    acceptedOffer.save({runValidators: true})
                })
        })
        // Reject all other offers for specified aircraft
        .then(() => {
            console.log(`Offer ${offerId} accepted successfully.`)
            Offer.find({aircraft: acId, _id: {$ne: offerId}})
                .then(otherOffers => {
                    otherOffers.forEach(offer => {
                        offer.accepted = "Rejected";
                        offer.save()
                            .then(() => {
                                console.log(`Offer ${offer._id} rejected successfully.`)
                            })
                    });
                })
        })
        // Notify the user and redirect to the offers page
        .then(() => {
            req.flash('success', 'Offer accepted successfully.');
            res.redirect(`/aircraft/${acId}/offers`);
        })
        .catch(err => {
            next(err);
        });
}