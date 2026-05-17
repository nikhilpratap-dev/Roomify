const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/roomify');
  console.log("mongo are working");
};

const initDb= async ()=>{
 await Listing.deleteMany({});
 initData.data=initData.data.map((obj)=>({
  ...obj,
  owner:"6a080c69a61c7a1e7cabb58c",
 }));
 await Listing.insertMany(initData.data);
 console.log("data insert successfully");
}

initDb();

