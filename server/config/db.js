import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/portfolio';

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.warn(
        `MONGO_URI is not defined. Falling back to default local database at ${DEFAULT_URI}`
      );
      mongoURI = DEFAULT_URI;
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
