using System;
using System.Collections.Generic;

namespace FootballBooking.Api.Entities
{
	public class FootballField
	{
		public Guid Id { get; set; }

		public string Name { get; set; } = null!;
		public string Location { get; set; } = null!;

		// Navigation
		public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
	}
}
