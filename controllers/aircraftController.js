const Aircraft = require('../models/aircraft');

// Index - GET /aircraft
exports.index = (req, res) => {
    const search = req.query.search;
    Aircraft.find({"$or": [{title: new RegExp(search, 'i')}, {details: new RegExp(search, 'i')}]})
        .then((aircraft) => {
            res.render('aircraft/index', {aircraft});
        });
}

// New - GET /aircraft/new
exports.new = (req, res) => {
    res.render('aircraft/new');
}

// Create - POST /aircraft
exports.create = (req, res, next) => {
    let newAircraft = new Aircraft(req.body);
    newAircraft.image = req.file.filename;
    newAircraft.save()
        .then((savedAircraft) => {
            console.log(savedAircraft);
            res.redirect(`/aircraft/${savedAircraft._id}`);
        })
        .catch(err => {
            next(err);
        })
}

// Show - GET /aircraft/:id
exports.show = (req, res, next) => {
    const id = req.params.id
    Aircraft.findById(id)
        .then((aircraft) => {
            res.render('aircraft/show', {aircraft});
        })
        .catch(err => {
            console.log('caught show');
            next(err);
        });
}

// Edit - GET /aircraft/:id/edit
exports.edit = (req, res, next) => {
    const id = req.params.id;
    Aircraft.findById(id)
        .then((aircraft) => {
            res.render('aircraft/edit', {aircraft});
        })
        .catch(err => {
            next(err);
        });
}

// Update - PUT /aircraft/:id
exports.update = (req, res, next) => {
    const id = req.params.id;
    let updatedAircraft = req.body;
    if (req.file) {
        updatedAircraft.image = req.file.filename;
    }
    Aircraft.updateOne({_id: id}, updatedAircraft)
        .then(() => {
            res.redirect(`/aircraft/${id}`);
        })
        .catch(err => {
            next(err);
        });
}

// Destroy - DELETE /aircraft/:id
exports.destroy = (req, res, next) => {
    const id = req.params.id;
    Aircraft.deleteOne({_id: id})
        .then(() => {
            res.redirect('/aircraft');
        })
        .catch(err => {
            next(err);
        });
}