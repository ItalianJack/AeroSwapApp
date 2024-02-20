const model = require('../models/aircraft');

// Index - GET /aircraft
exports.index = (req, res) => {
    const aircraft = model.find();
    res.render('aircraft/index', {aircraft, getConditionString: model.getConditionString});
}
// New - GET /aircraft/new
exports.new = (req, res) => {
    res.render('aircraft/new');
}

// Create - POST /aircraft
exports.create = (req, res) => {
    const newAircraft = req.body;
    newAircraft.image = req.file.filename;
    newAircraft.seller = 'Anonymous User'
    const id = model.create(newAircraft);
    res.redirect(`/aircraft/${id}`);
}


// Show - GET /aircraft/:id
exports.show = (req, res, next) => {
    const aircraft = model.findById(req.params.id);
    res.render('aircraft/show', {aircraft, getConditionString: model.getConditionString});
}

// Edit - GET /aircraft/:id/edit
exports.edit = (req, res) => {
    const aircraft = model.findById(req.params.id);
    res.render('aircraft/edit', {aircraft});
}

// Update - PUT /aircraft/:id
exports.update = (req, res) => {
    const updatedAircraft = req.body;
    if (req.file) {
        updatedAircraft.image = req.file.filename;
    }
    const id = req.params.id;
    model.updateById(id, updatedAircraft);
    res.redirect(`/aircraft/${id}`);
}

// Destroy - DELETE /aircraft/:id
exports.destroy = (req, res) => {
    const id = req.params.id;
    model.deleteById(id);
    res.redirect('/aircraft');
}