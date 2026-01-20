using System;
using System.Collections.Generic;

namespace FootballBooking.Api.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = null!;
        public string Phone { get; set; } = null!;

        // Navigation
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
