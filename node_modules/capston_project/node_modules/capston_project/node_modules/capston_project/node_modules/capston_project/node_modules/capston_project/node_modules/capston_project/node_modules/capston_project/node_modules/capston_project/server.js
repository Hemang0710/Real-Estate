const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));  // Serve static files
app.set("view engine", "ejs");      // Set EJS as the templating engine

// Configure image uploads
const storage = multer.diskStorage({
    destination: "public/images/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Path to the properties file
const filePath = path.join(__dirname, "properties.json");

// Helper function to get properties
const getProperties = () => {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : [];
};

// Route: Serve Home Page with First 3 Buy & Rent Properties
app.get("/", (req, res) => {
    let properties = getProperties();
    let buyProperties = properties.filter(p => p.title === "Buy").slice(0, 3);
    let rentProperties = properties.filter(p => p.title === "Rent").slice(0, 3);
    res.render("index", { buyProperties, rentProperties }); // Pass both buy & rent properties to EJS
});

// Route: Add New Property
// app.post("/properties", upload.single("image"), (req, res) => {
//     let properties = getProperties();

//     const newProperty = {
//         title: req.body.title,
//         addressLine1: req.body.addressLine1,
//         addressLine2: req.body.addressLine2,
//         price: req.body.price,
//         beds: req.body.beds,
//         baths: req.body.baths,
//         levels: req.body.levels,
//         sqft: req.body.sqft,
//         image: `/uploads/${req.file.filename}` // Save filename instead of Base64
//     };

//     properties.push(newProperty);
//     fs.writeFileSync(filePath, JSON.stringify(properties, null, 2));
//     // res.redirect("/"); // Reload the page with new property data
//     res.json({ message: "Property added successfully!", property: newProperty });
// });

// Route: Show Property Upload Page
app.get("/properties", (req, res) => {
    res.render("upload"); // Render upload.ejs
});
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Route: Add New Property
app.post("/properties", upload.single("image"), (req, res) => {
    let properties = getProperties();

    const newProperty = {
        title: req.body.title,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2 ,   
        price: req.body.price,
        beds: req.body.beds,
        baths: req.body.baths,
        levels: req.body.levels,
        sqft: req.body.sqft,
        image: `/images/${req.file.filename}` // Store image path
    };

    properties.push(newProperty);
    fs.writeFileSync(filePath, JSON.stringify(properties, null, 2));

    res.redirect("/"); // Redirect to homepage after adding property
});



// Route: Fetch All Properties as JSON
app.get("/api/properties", (req, res) => {
    res.json(getProperties());
});











//  Route: Show All Rent Properties
app.get("/rent", (req, res) => {
    let properties = getProperties();
    let rentProperties = properties.filter(p => p.title === "Rent");
    res.render("rent", { rentProperties });
});

//  Route: Show All Buy Properties
app.get("/buy", (req, res) => {
    let properties = getProperties();
    let buyProperties = properties.filter(p => p.title === "Buy");
    res.render("buy", { buyProperties });
});

// Route: Show Team Page
app.get("/team", (req, res) => {
    const teamMembers = [
        { name: "Iron Man", realtorNumber: "225.484.887", image: "/images/man_grey_suit.webp", email: "ironman@almira.com", phone: "555-1234" },
        { name: "Black Widow", realtorNumber: "437.123.877", image: "/images/scarletJohanson_pic.webp", email: "blackwidow@almira.com", phone: "437-756-2589" },
        { name: "Black Panther", realtorNumber: "859.422.887", image: "/images/blackpanther.webp", email: "tachala555@gmail.com", phone: "585-356-1478" },
        { name: "Winter Soldier", realtorNumber: "111.484.555", image: "/images/wintersoldier.webp", email: "buckybance5@gmail.com", phone: "879-356-5555" },
        { name: "Scarlet Witch", realtorNumber: "888.475.887", image: "/images/witch.webp", email: "blackmagic.queen@gmail.com", phone: "900-556-2222" },
        { name: "Captain America", realtorNumber: "333.888.999", image: "/images/captain_america.webp", email: "steve.rozer@gmail.com", phone: "485-777-9998" }
    ];
    
    // Render the team page with the data
    res.render("team", { teamMembers });
});

//  Route: Show News Page
app.get("/news", (req, res) => {
    const newsArticles = [
        { title: "Real Estate Market Update", summary: "Latest trends in the housing market." },
        { title: "Investment Tips", summary: "How to make smart real estate investments." },
        { title: "Luxury Homes", summary: "Exploring the most luxurious homes on the market." }
    ];
    res.render("news", { newsArticles }); // Passing the newsArticles data to the view
});

// Route: Show Contact Page
app.get("/contact", (req, res) => {
    res.render("contact");
  });
  

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
