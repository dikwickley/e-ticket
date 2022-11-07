import { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
import Layout from "../../components/Layout";
import dbConnect from "../../util/db";
import Ticket from "./../../models/Ticket.model";
import Order from "./../../models/Order.model";
import { Bar, Line } from "react-chartjs-2";

export default function Analytics({
  tickets,
  total_ticket_data,
  total_event_data,
  revenue_date_data,
}) {
  const revenue_per_day_options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      tooltips: { enabled: true },
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const revenue_per_day_data = {
    labels: Object.keys(revenue_date_data),
    datasets: [
      {
        label: "Day Revenue",
        data: Object.values(revenue_date_data),
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const event_participant_options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      tooltips: { enabled: true },
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const event_participant_data = {
    labels: Object.keys(total_event_data).map((key) => {
      return `${key} ${total_event_data[key].event_name}`;
    }),
    datasets: [
      {
        label: "Event Participants",
        data: Object.keys(total_event_data).map((key) => {
          return total_event_data[key].total_tickets;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const event_revenue_options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      tooltips: { enabled: true },
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const event_revenue_data = {
    labels: Object.keys(total_event_data).map((key) => {
      return `${key} ${total_event_data[key].event_name}`;
    }),
    datasets: [
      {
        label: "Event Revenue",
        data: Object.keys(total_event_data).map((key) => {
          return (
            total_event_data[key].total_tickets * total_event_data[key].price
          );
        }),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  useEffect(() => {}, []);

  return (
    <Layout access={"admin"} title={"Analytics"}>
      <div className="flex flex-col justify-center items-center min-h-[70vh] w-[100vw]">
        <div className="mt-10 sm:mt-0 w-full lg:w-[70%] mx-auto p-10">
          <div className="self-center mb-10 text-3xl text-center md:text-5xl">
            Analytics
          </div>
          <div className="md:grid md:grid-cols-1 md:gap-6">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="px-1 py-3 text-right bg-gray-50 sm:px-6">
                <div className="flex flex-col items-center">
                  <div className="flex flex-col text-center md:flex-row ">
                    <div className="m-3">
                      <div className="text-2xl font-extrabold">
                        Total Tickets
                      </div>
                      <div className="text-6xl font-extrabold leading-none text-transparent md:text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {tickets.length || "#"}
                      </div>
                    </div>
                    <div className="m-3">
                      <div className="text-2xl font-extrabold">
                        Total Participants
                      </div>
                      <div className="text-6xl font-extrabold leading-none text-transparent md:text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {total_ticket_data.total_ticket_participants || "#"}
                      </div>
                    </div>
                    <div className="m-3">
                      <div className="text-2xl font-extrabold">
                        Total Amount
                      </div>
                      <div className="text-6xl font-extrabold leading-none text-transparent md:text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        ₹{total_ticket_data.total_ticket_price || "#"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 md:grid md:grid-cols-1 md:gap-6">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <div className="flex flex-col items-center">
                    <div className="self-center mb-10 text-2xl text-center">
                      Revenue per day
                    </div>
                    <Line
                      options={revenue_per_day_options}
                      data={revenue_per_day_data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 md:grid md:grid-cols-1 md:gap-6">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <div className="flex flex-col items-center">
                    <div className="self-center mb-10 text-2xl text-center">
                      Participants per Event
                    </div>
                    <Bar
                      options={event_participant_options}
                      data={event_participant_data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 md:grid md:grid-cols-1 md:gap-6">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <div className="flex flex-col items-center">
                    <div className="self-center mb-10 text-2xl text-center">
                      Revenue per Event
                    </div>
                    <Bar
                      options={event_revenue_options}
                      data={event_revenue_data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 md:grid md:grid-cols-1 md:gap-6">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <div className="self-center mb-10 text-2xl text-center">
                    Participants per Event
                  </div>
                  <div className="flex flex-col items-center md:flex-row md:flex-wrap">
                    {/* <Bar
                      options={event_revenue_options}
                      data={event_revenue_data}
                    /> */}
                    {Object.keys(total_event_data).map((key, index) => {
                      return (
                        <EventCard
                          key={index}
                          event_name={total_event_data[key].event_name}
                          event_code={key}
                          total_tickets={total_event_data[key].total_tickets}
                          total_participants={
                            total_event_data[key].total_tickets *
                            total_event_data[key].type
                          }
                          total_revenue={
                            total_event_data[key].total_tickets *
                            total_event_data[key].price
                          }
                        />
                      );
                    })}
                    <EventCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const EventCard = ({
  event_name,
  event_code,
  total_tickets,
  total_participants,
  total_revenue,
}) => {
  return (
    <div className="overflow-hidden shadow sm:rounded-md w-full md:w-[20vw] min-h-100[px] my-3 p-3 md:p-5 md:m-2">
      <div className="flex flex-col ">
        <h3 className="text-2xl font-medium leading-6 text-indigo-600">
          <label className="text-lg leading-none text-black">
            {event_code || "code"}
          </label>{" "}
          <h1 className="text-3xl font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {event_name || "Event Name"}
          </h1>
        </h3>
        <div className="flex flex-row justify-between mt-3">
          <p className="mt-1 text-sm text-gray-600">
            Total Participants {total_participants || 0}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Total Tickets {total_tickets || 0}
          </p>
        </div>
        <div className="flex flex-row justify-between mt-3">
          <p className="mt-1 text-sm text-gray-600">
            Total Revenue {total_revenue || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await dbConnect();

  let tickets = await Ticket.find({});
  tickets = JSON.parse(JSON.stringify(tickets));

  let orders = await Order.find({});
  orders = JSON.parse(JSON.stringify(orders));

  let revenue_date_data = {};

  for (let x in orders) {
    let date = orders[x].issue_date.split("T")[0];
    if (!revenue_date_data.hasOwnProperty(date)) {
      revenue_date_data[date] = 0;
    }
    let _t = orders[x].tickets;
    let _order_total = 0;

    for (let y in _t) {
      _order_total += parseInt(_t[y].events.price);
    }

    revenue_date_data[date] += _order_total;
  }

  let total_ticket_data = {
    total_ticket_price: 0,
    total_ticket_participants: 0,
  };

  let total_event_data = {};

  for (let x in tickets) {
    total_ticket_data.total_ticket_price += tickets[x].events.price;
    total_ticket_data.total_ticket_participants += tickets[x].events.type;

    if (!total_event_data.hasOwnProperty(tickets[x].events.eventCode)) {
      total_event_data[tickets[x].events.eventCode] = {
        total_tickets: 1,
        event_name: tickets[x].events.name,
        price: tickets[x].events.price,
        type: tickets[x].events.type,
      };
    } else {
      total_event_data[tickets[x].events.eventCode].total_tickets += 1;
    }
  }

  if (!tickets) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        tickets,
        total_ticket_data,
        total_event_data,
        revenue_date_data,
      },
    };
  }
}
