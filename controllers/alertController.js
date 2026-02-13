const Alert = require("../models/Alert");

/* GET ALL ALERTS */

exports.getAllAlerts = async (req, res) => {
   try {
      const alerts = await Alert.find()
         .populate("assignedTo", "name email role")
         .sort({ createdAt: -1 });

      res.json(alerts);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

/* UPDATE STATUS */

exports.updateAlertStatus = async (req, res) => {
   try {
      const { status } = req.body;

      const alert = await Alert.findByIdAndUpdate(
         req.params.id,
         { status },
         { new: true }
      );

      res.json(alert);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

/* ASSIGN ALERT */

exports.assignAlert = async (req, res) => {
   try {
      const { analystId } = req.body;

      const alert = await Alert.findByIdAndUpdate(
         req.params.id,
         { assignedTo: analystId },
         { new: true }
      );

      res.json(alert);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

/* ADD NOTE */

exports.addNote = async (req, res) => {
   try {
      const { message } = req.body;

      const alert = await Alert.findById(req.params.id);

      alert.notes.push({
         message,
         addedBy: req.user.id
      });

      await alert.save();

      res.json(alert);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

/* DASHBOARD STATS */

exports.getDashboardStats = async (req, res) => {
   try {

      const totalAlerts = await Alert.countDocuments();

      const openAlerts = await Alert.countDocuments({ status: "OPEN" });
      const inProgressAlerts = await Alert.countDocuments({ status: "IN_PROGRESS" });
      const closedAlerts = await Alert.countDocuments({ status: "CLOSED" });

      const criticalAlerts = await Alert.countDocuments({ severity: "CRITICAL" });
      const highAlerts = await Alert.countDocuments({ severity: "HIGH" });

      const alertsBySeverity = await Alert.aggregate([
         {
            $group: {
               _id: "$severity",
               count: { $sum: 1 }
            }
         }
      ]);

      const alertsByStatus = await Alert.aggregate([
         {
            $group: {
               _id: "$status",
               count: { $sum: 1 }
            }
         }
      ]);

      const recentAlerts = await Alert.find()
         .sort({ createdAt: -1 })
         .limit(5);

      res.json({
         totalAlerts,
         openAlerts,
         inProgressAlerts,
         closedAlerts,
         criticalAlerts,
         highAlerts,
         alertsBySeverity,
         alertsByStatus,
         recentAlerts
      });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

exports.getAlertTrends = async (req, res) => {
   try {

      const trends = await Alert.aggregate([
         {
            $group: {
               _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
               },
               count: { $sum: 1 }
            }
         },
         { $sort: { _id: 1 } }
      ]);

      res.json(trends);

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
