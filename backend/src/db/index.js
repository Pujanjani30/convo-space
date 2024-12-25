import mongoose from 'mongoose';

mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
  .then((conn) => {
    console.log('MongoDB connected !! DB HOST: ', conn.connection.host);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  });