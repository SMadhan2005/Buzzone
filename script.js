// Sample bus data (in a real application, this would come from a backend)
const buses = [
    {
        id: 1,
        busNumber: "BUS001",
        from: "New York",
        to: "Boston",
        departure: "2024-03-20T08:00:00",
        availableSeats: 20,
        price: 45.00
    },
    {
        id: 2,
        busNumber: "BUS002",
        from: "Boston",
        to: "New York",
        departure: "2024-03-20T10:00:00",
        availableSeats: 15,
        price: 45.00
    },
    {
        id: 3,
        busNumber: "BUS003",
        from: "New York",
        to: "Philadelphia",
        departure: "2024-03-20T09:00:00",
        availableSeats: 25,
        price: 35.00
    }
];

// Store bookings in localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// DOM Elements
const searchForm = document.getElementById('searchForm');
const busList = document.getElementById('busList');
const bookingSection = document.getElementById('booking');
const bookingForm = document.getElementById('bookingForm');
const bookingsList = document.getElementById('bookingsList');
const seatsInput = document.getElementById('seats');
const totalPriceSpan = document.getElementById('totalPrice');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
bookingForm.addEventListener('submit', handleBooking);
seatsInput.addEventListener('input', updateTotalPrice);

// Handle search form submission
function handleSearch(e) {
    e.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;

    // Get buses from localStorage
    const buses = JSON.parse(localStorage.getItem('buses')) || [];

    // Filter buses based on search criteria
    const filteredBuses = buses.filter(bus => {
        const busDate = new Date(bus.departure).toISOString().split('T')[0];
        return bus.from.toLowerCase() === from.toLowerCase() &&
            bus.to.toLowerCase() === to.toLowerCase() &&
            busDate === date;
    });

    displayBuses(filteredBuses);
}

// Display buses in the results section
function displayBuses(buses) {
    busList.innerHTML = '';

    if (buses.length === 0) {
        busList.innerHTML = '<p class="no-results">No buses found matching your criteria.</p>';
        return;
    }

    buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <h3>Bus ${bus.busNumber}</h3>
            <p>From: ${bus.from}</p>
            <p>To: ${bus.to}</p>
            <p>Departure: ${new Date(bus.departure).toLocaleString()}</p>
            <p>Available Seats: ${bus.availableSeats}</p>
            <p>Price: $${bus.price.toFixed(2)}</p>
            <button class="btn" onclick="selectBus(${bus.id})">Book Now</button>
        `;
        busList.appendChild(busCard);
    });
}

// Handle bus selection
function selectBus(busId) {
    const buses = JSON.parse(localStorage.getItem('buses')) || [];
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    // Update booking section with selected bus details
    document.getElementById('selectedBusNumber').textContent = `Bus ${bus.busNumber}`;
    document.getElementById('selectedFrom').textContent = bus.from;
    document.getElementById('selectedTo').textContent = bus.to;
    document.getElementById('selectedDeparture').textContent = new Date(bus.departure).toLocaleString();
    document.getElementById('selectedSeats').textContent = bus.availableSeats;
    document.getElementById('selectedPrice').textContent = bus.price.toFixed(2);

    // Show booking section
    bookingSection.classList.remove('hidden');
    bookingSection.scrollIntoView({ behavior: 'smooth' });

    // Store selected bus ID
    bookingForm.dataset.busId = busId;
}

// Update total price based on number of seats
function updateTotalPrice() {
    const seats = parseInt(seatsInput.value) || 0;
    const busId = parseInt(bookingForm.dataset.busId);
    const buses = JSON.parse(localStorage.getItem('buses')) || [];
    const bus = buses.find(b => b.id === busId);

    if (bus) {
        const total = seats * bus.price;
        totalPriceSpan.textContent = total.toFixed(2);
    }
}

// Handle booking form submission
function handleBooking(e) {
    e.preventDefault();

    const busId = parseInt(bookingForm.dataset.busId);
    const buses = JSON.parse(localStorage.getItem('buses')) || [];
    const bus = buses.find(b => b.id === busId);

    if (!bus) return;

    const seatsBooked = parseInt(document.getElementById('seats').value);

    if (seatsBooked > bus.availableSeats) {
        alert('Not enough seats available!');
        return;
    }

    const booking = {
        id: Date.now(),
        busId: busId,
        busNumber: bus.busNumber,
        from: bus.from,
        to: bus.to,
        departure: bus.departure,
        passengerName: document.getElementById('passengerName').value,
        passengerEmail: document.getElementById('passengerEmail').value,
        seatsBooked: seatsBooked,
        totalPrice: parseFloat(totalPriceSpan.textContent),
        bookingDate: new Date().toISOString()
    };

    // Add booking to array and update localStorage
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Update available seats
    bus.availableSeats -= seatsBooked;
    localStorage.setItem('buses', JSON.stringify(buses));

    // Reset form and hide booking section
    bookingForm.reset();
    bookingSection.classList.add('hidden');
    totalPriceSpan.textContent = '0';

    // Show success message
    alert('Booking successful!');

    // Update bookings display
    displayBookings();
}

// Display bookings in the My Bookings section
function displayBookings() {
    bookingsList.innerHTML = '';

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>No bookings found.</p>';
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'bus-card';
        bookingCard.innerHTML = `
            <h3>Booking #${booking.id}</h3>
            <p>Bus: ${booking.busNumber}</p>
            <p>From: ${booking.from}</p>
            <p>To: ${booking.to}</p>
            <p>Departure: ${new Date(booking.departure).toLocaleString()}</p>
            <p>Passenger: ${booking.passengerName}</p>
            <p>Seats Booked: ${booking.seatsBooked}</p>
            <p>Total Price: $${booking.totalPrice.toFixed(2)}</p>
            <p>Booking Date: ${new Date(booking.bookingDate).toLocaleString()}</p>
        `;
        bookingsList.appendChild(bookingCard);
    });
}

// Initial display of bookings
displayBookings(); 