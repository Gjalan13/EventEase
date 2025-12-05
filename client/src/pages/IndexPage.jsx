/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";

export default function IndexPage() {
  const [events, setEvents] = useState([]);

  //! Fetch events
  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  //! Like
  const handleLike = (eventId) => {
    axios
      .post(`/event/${eventId}`)
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, likes: event.likes + 1 }
              : event
          )
        );
      })
      .catch((error) => {
        console.error("Error liking ", error);
      });
  };

  return (
    <div className="min-h-screen bg-primary-900 text-white">
      {/* Hero Section */}
      <div className="hidden sm:block relative w-full h-[400px]">
        <img
          src="../src/assets/hero.jpg"
          alt="Hero"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-900/65"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-white drop-shadow-lg">
            Event Ease
          </h1>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mx-5 my-10">
        <h2 className="text-3xl font-bold text-primary-100 mb-6">
          Upcoming Events
        </h2>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.length > 0 ? (
            events.map((event) => {
              const eventDate = new Date(event.eventDate);
              const currentDate = new Date();

              if (eventDate >= currentDate.setHours(0, 0, 0, 0)) {
                return (
                  <div
                    key={event._id}
                    className="bg-primary-800 rounded-xl shadow-lg overflow-hidden 
                    hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full">
                      <img
                        src="../src/assets/poster1.jpg"
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(event._id)}
                        className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md
                        hover:bg-primary-100 transition"
                      >
                        <BiLike className="w-6 h-6 text-red-600" />
                      </button>
                    </div>

                    {/* Event Details */}
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-lg text-white truncate">
                        {event.title.toUpperCase()}
                      </h3>

                      <div className="flex justify-between text-sm text-primary-100 font-semibold">
                        <span>
                          {event.eventDate.split("T")[0]} | {event.eventTime}
                        </span>
                        <span>
                          {event.ticketPrice === 0
                            ? "Free"
                            : `Rs. ${event.ticketPrice}`}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex justify-between text-sm text-primary-100 mt-2">
                        <div>
                          <span className="font-bold text-primary-200">
                            Organized By:
                          </span>{" "}
                          <br />
                          {event.organizedBy}
                        </div>
                        <div>
                          <span className="font-bold text-primary-200">
                            Created By:
                          </span>{" "}
                          <br />
                          {event.owner.toUpperCase()}
                        </div>
                      </div>

                      {/* Book Ticket */}
                      <Link
                        to={`/event/${event._id}`}
                        className="flex justify-center mt-4"
                      >
                        <button className="primary w-full flex items-center gap-2 justify-center bg-primary-600 hover:bg-primary-500">
                          Book Ticket
                          <BsArrowRightShort className="w-6 h-6" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              }

              return null;
            })
          ) : (
            <p className="text-gray-300 col-span-full text-center">
              No upcoming events.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
