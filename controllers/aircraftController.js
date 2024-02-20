const model = require('../models/aircraft');

// Index - GET /aircraft
exports.index = (req, res) => {
    const search = req.query.search;
    const aircraft = model.find(search);
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
    const id = model.create(newAircraft);
    res.redirect(`/aircraft/${id}`);
}

// Show - GET /aircraft/:id
exports.show = (req, res, next) => {
    const id = req.params.id
    const aircraft = model.findById(id);
    if (aircraft) {
        res.render('aircraft/show', {aircraft, getConditionString: model.getConditionString});
    } else {
        let err = new Error(`No aircraft found with id ${id}`);
        err.status = 404;
        next(err);
    }
}

// Edit - GET /aircraft/:id/edit
exports.edit = (req, res, next) => {
    const id = req.params.id;
    const aircraft = model.findById(id);
    if (aircraft) {
        res.render('aircraft/edit', {aircraft});
    } else {
        let err = new Error(`No aircraft found with id ${id}`);
        err.status = 404;
        next(err);
    }
}

// Update - PUT /aircraft/:id
exports.update = (req, res, next) => {
    const updatedAircraft = req.body;
    if (req.file) {
        updatedAircraft.image = req.file.filename;
    }
    const id = req.params.id;
    const success = model.updateById(id, updatedAircraft);
    if (success) {
        res.redirect(`/aircraft/${id}`);
    } else {
        let err = new Error(`No aircraft found with id ${id}`);
        err.status = 404;
        next(err);
    }
}

// Destroy - DELETE /aircraft/:id
exports.destroy = (req, res, next) => {
    const id = req.params.id;
    const success = model.deleteById(id);
    if (success) {
        res.redirect('/aircraft');
    } else {
        let err = new Error(`No aircraft found with id ${id}`);
        err.status = 404;
        next(err);
    }

}