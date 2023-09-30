import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import RestaurantTableBooking from "./services/restaurant.js";
import pgPromise from 'pg-promise';

const app = express()

app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

const DATABASE_URL= process.env.DATABASE_URL || "postgresql://coder:coder123@localhost:5432/bookings";
const connectionString = DATABASE_URL;
const db = pgPromise()(connectionString);
const restaurantTableBooking = await RestaurantTableBooking(db);

app.get("/", async (req, res) => {
    const tables = await restaurantTableBooking.getTables();
    res.render('index', { tables })
});


app.get("/bookings", (req, res) => {
    res.render('bookings', { tables : [{}, {}, {}, {}, {}, {}]})
});


var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});