import Head from "next/head";
import Order from "../../../models/Order.model";
import dbConnect from "../../../util/db";

export default function OrderTickets({ tickets, collegeid }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] w-[100vw]">
      <Head>
        <title>eticket</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="w-full p-3 mt-0 text-xl font-extrabold text-center text-white bg-indigo-600">
        eticket {collegeid}
      </div>

      <div className="sm:mt-0 w-full lg:w-[70%] mx-auto p-10">
        {tickets.map((ticket, index) => {
          return (
            <Ticket
              key={index}
              name={ticket.events.name}
              eventCode={ticket.events.eventCode}
              department={ticket.events.department}
              date={ticket.events.date}
              price={ticket.events.price}
              participants={ticket.participants}
            />
          );
        })}
      </div>
    </div>
  );
}

const Participant = ({ email, collegeid }) => {
  return (
    <div className="flex flex-row justify-between w-full">
      <div>{email}</div>
      <div>{collegeid}</div>
    </div>
  );
};

const Ticket = ({ name, department, eventCode, date, price, participants }) => {
  return (
    <div className="my-2 md:col-span-2 md:mt-0">
      <div className="overflow-hidden shadow sm:rounded-md">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="flex flex-row justify-between">
            <h3 className="text-2xl font-medium leading-6 text-indigo-600">
              <label className="text-lg text-black">
                {eventCode || "code"}
              </label>{" "}
              {name || "Event Name"}
            </h3>
          </div>
          <div className="flex flex-row justify-between">
            <p className="mt-1 text-sm text-gray-600">{department || "dept"}</p>
            <p className="mt-1 text-sm text-gray-600">
              {date?.split("T")[0] || "date"}
            </p>
          </div>

          <div className="my-2">
            {participants?.map((participant, index) => {
              return (
                <Participant
                  key={index}
                  email={participant.email}
                  collegeid={participant.collegeid}
                />
              );
            })}
          </div>
          <div className="flex justify-end">
            <p className="mt-1 text-sm text-gray-600">Price {price} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await dbConnect();

  const collegeid = context.params.collegeid;

  const orders = await Order.find({
    student_collegeid: collegeid,
  });

  console.trace({ orders });

  let _tickets = [];
  for (var i in orders) {
    for (var j in orders[i]["tickets"]) {
      _tickets.push(orders[i]["tickets"][j]);
    }
  }
  console.log(_tickets);

  if (!orders) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const tickets = JSON.parse(JSON.stringify(_tickets));
    return { props: { tickets, collegeid } };
  }
}
