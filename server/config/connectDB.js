const mongoose = require('mongoose');

// Event Listeners for Mongoose Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('Error in MongoDB connection:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Database Connection Function
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Simplified connection
        console.log('Database connection successful');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if the database connection fails
    }
}

module.exports = connectDB;
