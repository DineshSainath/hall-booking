Hall-Booking system

Name: Dinesh Sainath

Render URL : https://hall-booking-dqg8.onrender.com
GitHub URL : https://github.com/DineshSainath/hall-booking
Last committed hash id : ce35431

Endpoints:

1. Creating a room
    POST: http://localhost:3000/rooms
    Body: json

2. Booking a Room
    POST: http://localhost:3000/bookings
    Body: JSON format

3. List all Rooms with Booked Data
    GET: http://localhost:3000/rooms/bookings

4. List all Customers with Booked Data
    GET: http://localhost:3000/customers/bookings

5. List How Many Times a Customer Has Booked the Room
    GET: http://localhost:3000/customers/:name/bookings