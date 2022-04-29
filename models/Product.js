var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var mysort = { name: -1 };
  dbo.collection("customers").find().sort(mysort).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

var mongoDB = "mongodb://localhost:27017/NoSQLBoosterSamples"

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;

const ProductSchema = new Schema({
    name : {type:String, required: [true, "Name required"]},
    price: {type:Number},
    device: {type:String},
    picURL: {type:String}
})

module.exports = mongoose.model('Product', ProductSchema);