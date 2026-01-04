import mongoose from "mongoose";

// Cache de la conexión para Vercel serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async () => {
  // Si ya existe una conexión activa y lista, la reutilizamos
  if (cached.conn) {
    // Verificar si la conexión sigue activa (readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // Si la conexión está cerrada, resetear el cache
    if (mongoose.connection.readyState === 0) {
      cached.conn = null;
    }
  }

  // Si no hay una promesa de conexión en proceso, creamos una nueva
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Mantener hasta 10 sockets conectados
      serverSelectionTimeoutMS: 5000, // Mantener la conexión por 5 segundos
      socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("Conectado con MONGODB");
        
        // Manejar eventos de desconexión
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
