const Incident = require("../models/Incident");

exports.createIncident = async (req, res) => {
   try {
      const incident = await Incident.create(req.body);
      res.status(201).json(incident);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

exports.addNote = async (req, res) => {
   try {
      const { message } = req.body;

      const incident = await Incident.findById(req.params.id);

      incident.notes.push({
         message,
         addedBy: req.user.id
      });

      await incident.save();

      res.json(incident);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

exports.getIncidents = async (req, res) => {
   try {
      const incidents = await Incident.find().populate("alert");
      res.json(incidents);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
