import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
   throw Error("invalid Url");
}
let cached = global.connection;
if (!cached) {
   cached = global.connection = { conn: null, promise: null };
}
const connectDb = async () => {
   if (cached.conn) {
      return cached.conn;
   }
   if (!cached.promise) {
      cached.promise = mongoose.connect(mongodbUrl).then((c) => c.connection);
   }
   try {
      const conn = await cached.promise;
      return conn;
   } catch (error) {
      console.error(error);
   }
};

export default connectDb;
