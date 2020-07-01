const mongoose = require("mongoose");
const databaseName = "test";

beforeAll(async done => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: true,
    useUnifiedTopology: true,
    poolSize: 5
   });
   done();
});