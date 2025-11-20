import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado con MONGODB");
  } catch (error) {
    console.log("Error al conectar con MongoDB" + error);
  }
};

export default connectMongoDB;
