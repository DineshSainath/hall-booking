const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

//to store data
let rooms = [];
let bookings = [];

//to check if a room is available
function isRoomAvailable(roomId, date, startTime, endTime) {
  return !bookings.some(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime))
  );
}

// 1. Creating a Room
app.post("/rooms", (req, res) => {
  const { name, seats, amenities, pricePerHour } = req.body;
  const newRoom = {
    id: rooms.length + 1,
    name,
    seats,
    amenities,
    pricePerHour,
  };
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

// 2. Booking a Room
app.post("/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  if (!isRoomAvailable(roomId, date, startTime, endTime)) {
    return res
      .status(400)
      .json({ error: "Room is not available for the selected time slot." });
  }

  const newBooking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
    bookingDate: new Date().toISOString(),
    status: "Confirmed",
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// 3. List all Rooms with Booked Data
app.get("/rooms/bookings", (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id
    );
    return {
      ...room,
      bookings: roomBookings.map(
        ({ customerName, date, startTime, endTime, status }) => ({
          customerName,
          date,
          startTime,
          endTime,
          status,
        })
      ),
    };
  });
  res.json(roomsWithBookings);
});

// 4. List all customers with booked Data
app.get("/customers/bookings", (req, res) => {
  const customersWithBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.customerName]) {
      acc[booking.customerName] = [];
    }
    acc[booking.customerName].push({
      roomName: rooms.find((room) => room.id === booking.roomId).name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
    return acc;
  }, {});
  res.json(customersWithBookings);
});

// 5. List how many times a customer has booked the room
app.get("/customers/:name/bookings", (req, res) => {
  const { name } = req.params;
  const customerBookings = bookings.filter(
    (booking) => booking.customerName === name
  );
  const bookingDetails = customerBookings.map((booking) => ({
    //mapping data
    customerName: booking.customerName,
    roomName: rooms.find((room) => room.id === booking.roomId).name,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    bookingId: booking.id,
    bookingDate: booking.bookingDate,
    bookingStatus: booking.status,
  }));
  res.json(bookingDetails);
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Hall Booking API");
});

//booking a room
app.get("/bookings", (req, res) => {
  res.send(
    "Use POST /bookings to book a room. Body should include customerName, date, startTime, endTime, and roomId."
  );
});

// listing all rooms with bookings
app.get("/rooms/bookings/description", (req, res) => {
  res.send("Use GET /rooms/bookings to list all rooms with their bookings.");
});

//listing all customers with bookings
app.get("/customers/bookings/description", (req, res) => {
  res.send(
    "Use GET /customers/bookings to list all customers with their bookings."
  );
});

//listing a customer's bookings
app.get("/customers/:name/bookings/description", (req, res) => {
  res.send(
    "Use GET /customers/:name/bookings to list all bookings for a specific customer."
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
