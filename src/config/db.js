import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async () => {
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    if (mongoose.connection.readyState === 0) {
      cached.conn = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("Conectado con MONGODB");
        
        mongoose.connection.on("disconnected", () => {
          console.log("MongoDB desconectado");
          cached.conn = null;
          cached.promise = null;
        });

        mongoose.connection.on("error", (err) => {
          console.log("Error en MongoDB:", err);
          cached.conn = null;
          cached.promise = null;
        });

        return mongoose;
      })
      .catch((error) => {
        console.log("Error al conectar con MongoDB:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectMongoDB;
