import mongoose from "mongoose";

const uri = "mongodb+srv://shaao_admin:mJj202gaqriUvwti@cluster0.lvtev9k.mongodb.net/Shaao-TheCharityTerm?retryWrites=true&w=majority
";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed", err);
    process.exit(1);
  });