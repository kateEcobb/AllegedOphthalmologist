var mongoose = require('mongoose');

var meterReadingSchema = new mongoose.Schema({ 
  interval_end: Date,
  interval_kW: Number,
  interval_kWh: Number,
  interval_start: Date,
  service_uid: Number,
  source: String,
  updated: Date,
  utility: String,
  utility_meter_number: String,
  utility_service_address: String,
  utility_service_id: String,
  utility_tariff_name: String 
});

meterReadingSchema.index({service_uid: 1, interval_end: -1});

var MeterReading = mongoose.model('MeterReading', meterReadingSchema);

module.exports = MeterReading;