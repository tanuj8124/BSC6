require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const Testimonial = require('./models/Testimonial');
const Contact = require('./models/Contact');
const Booking = require('./models/Booking');

// Email Transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes

// Get all destinations
app.get('/api/destinations', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single destination
app.get('/api/destinations/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.json(destination);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all packages
app.get('/api/packages', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single package
app.get('/api/packages/:id', async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) return res.status(404).json({ message: 'Package not found' });
        res.json(package);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get testimonials
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Save to database
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();
        
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Form Submission',
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Message: ${message}
            `,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(201).json({ message: 'Thank you for your message! We will contact you soon.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { packageId, name, email, phone, date, travelers, specialRequests } = req.body;
        
        // Save booking
        const newBooking = new Booking({
            package: packageId,
            name,
            email,
            phone,
            date,
            travelers,
            specialRequests,
            status: 'pending'
        });
        
        await newBooking.save();
        
        // Send confirmation email
        const package = await Package.findById(packageId);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Tour Booking Confirmation',
            html: `
                <h2>Thank you for your booking, ${name}!</h2>
                <h3>${package.name}</h3>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                <p><strong>Travelers:</strong> ${travelers}</p>
                <p><strong>Special Requests:</strong> ${specialRequests || 'None'}</p>
                <p>We will contact you shortly to confirm your booking details and payment.</p>
                <p>For any questions, please contact us at ${process.env.CONTACT_PHONE} or reply to this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(201).json({ 
            message: 'Booking received! Check your email for confirmation.',
            booking: newBooking
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search destinations
app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        const destinations = await Destination.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});