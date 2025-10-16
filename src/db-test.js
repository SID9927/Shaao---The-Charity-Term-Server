import mongoose from "mongoose";

const uri = "mongodb+srv://dsid952_db_user:TsWhWHXW4QOxJ8iC@cluster0.g3200hq.mongodb.net/lottery_app?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed", err);
    process.exit(1);
  });