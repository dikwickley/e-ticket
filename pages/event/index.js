import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function Event() {
  const [events, setEvent] = useState(null);

  const fetchEvents = async () => {
    const res = await fetch(`/api/event`);
    const data = await res.json();
    setEvent(data.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <Layout title={"All Events"}>
      <div className="flex flex-col items-center justify-center font-extrabold">
        <div className="py-10 text-6xl">Events</div>
        <div className="flex flex-col flex-wrap justify-center mb-20 md:flex-row">
          {events &&
            events.map((event, index) => {
              return (
                <EventCard
                  key={index}
                  name={event.name}
                  department={event.department}
                  code={event.eventCode}
                  description={event.description}
                  price={event.price}
                  type={event.type}
                  date={event.date}
                  id={event._id}
                />
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

const EventCard = ({
  name,
  department,
  code,
  description,
  price,
  type,
  date,
  id,
}) => {
  return (
    <div className="overflow-hidden shadow sm:rounded-md w-full md:w-[20vw] min-h-100[px] my-3 p-3 md:p-5 md:m-2">
      <div className="flex flex-col ites">
        <h3 className="text-2xl font-medium leading-6 text-indigo-600">
          <label className="text-lg leading-none text-black">
            {code || "code"}
          </label>{" "}
          <h1 class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-none">
            {name || "Event Name"}
          </h1>
        </h3>
        <div className="flex flex-row justify-between mt-3">
          <p className="mt-1 text-sm text-gray-600">{department || "dept"}</p>
          <p className="mt-1 text-sm text-gray-600">
            {date?.split("T")[0] || "date"}
          </p>
        </div>
        <div className="flex flex-row justify-between mt-3">
          <p className="mt-1 ">{description || "description"}</p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <p className="mt-1 text-sm text-gray-600">Price {price} </p>
          <p className="mt-1 text-sm text-gray-600">
            Number of Participants {type}{" "}
          </p>
          <p className="mt-1 text-sm text-gray-600">EventID {id} </p>
        </div>
      </div>
    </div>
  );
};
