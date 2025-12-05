import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { BiLike } from "react-icons/bi";

export default function UserAccountPage() {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch all events only when NOT a visitor
    if (user?.role !== "visitor") {
      axios.get("/events").then(({ data }) => {
        setEvents(data);
      });
    }
  }, [user]);

  if (user?.role === "visitor") {
    return <TicketPage userId={user._id} />;
  }

  return (
    <div className="px-6 md:px-10 py-10">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8">
        Welcome, {user?.name?.toUpperCase()}
      </h1>
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.length > 0 &&
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden border hover:shadow-xl transition-all"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src="../src/assets/poster1.jpg"
                  alt={event.title}
                  className="h-full w-full object-cover"
                />

                {/* Likes */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow">
                  <BiLike className="text-primary" />
                  <span className="text-sm font-semibold">{event.likes}</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {event.title}
                </h3>

                <div className="flex justify-between text-sm text-primary-700 font-semibold">
                  <span>
                    {event.eventDate.split("T")[0]} — {event.eventTime}
                  </span>
                  <span>
                    {event.ticketPrice === 0
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>
                    Organized by:
                    <br />
                    <strong className="text-gray-800">
                      {event.organizedBy}
                    </strong>
                  </span>

                  <span>
                    Created by:
                    <br />
                    <strong className="text-gray-800">
                      {event.owner?.toUpperCase()}
                    </strong>
                  </span>
                </div>

                <div className="mt-3">
                  <Link
                    to={`/event/${event._id}`}
                    className="block bg-primary text-white font-semibold text-center py-2 rounded-lg hover:bg-primary-800 transition"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
