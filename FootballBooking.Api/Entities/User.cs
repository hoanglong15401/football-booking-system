using System;
using System.Collections.Generic;

namespace FootballBooking.Api.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        // CHỈ GIỮ PasswordHash
        public string PasswordHash { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string Role { get; set; } = "User";

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
