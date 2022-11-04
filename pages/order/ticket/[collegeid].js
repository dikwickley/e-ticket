import Head from "next/head";
import Order from "../../../models/Order.model";
import dbConnect from "../../../util/db";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function OrderTickets({ tickets, collegeid, student_info }) {
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    if (!domain) setDomain(window.location.host);
  }, []);

  // console.log(tickets);
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] w-[100vw]">
      <Head>
        <title>eticket</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="w-full p-3 mt-0 text-xl font-extrabold text-center text-white bg-gradient-to-r from-[#631c24] via-[#da6024] to-[#fbca4a]">
        eticket {collegeid}
      </div>

      <div className="mt-10 text-center">
        <div className="z-0">
          <Image
            src={"/small_logo.png"}
            alt={"logo"}
            width={200}
            height={200}
          />
        </div>
        <div className="text-3xl">{student_info.student_name}</div>
        <p className="mt-1 text-sm text-gray-600">
          {student_info.student_email} <br /> {student_info.student_phone}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center mt-10">
        <QRCode
          value={`https://e-ticket-omega.vercel.app/order/ticket/${collegeid}`}
        />
        <div className="mt-3 text-sm text-center text-gray-600">{domain}</div>
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
              order_id={ticket.order_id}
            />
          );
        })}
      </div>

      {/* <div className="self-start m-10">
        Order IDs:
        {order_ids?.map((order_id, index) => {
          return (
            <p key={index} className="mt-1 text-sm text-gray-600">
              {order_id}
            </p>
          );
        })}
      </div> */}
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

const Ticket = ({
  name,
  department,
  eventCode,
  date,
  price,
  participants,
  order_id,
}) => {
  return (
    <div className="my-2 md:col-span-2 md:mt-0">
      <div className="overflow-hidden shadow sm:rounded-md">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="flex flex-row justify-between">
            <h3 className="text-2xl font-medium leading-6 text-indigo-600">
              <label className="text-lg leading-none text-black">
                {eventCode || "code"}
              </label>{" "}
              <h1 class="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-none">
                {name || "Event Name"}
              </h1>
            </h3>
          </div>
          <div className="flex flex-row justify-between mt-3">
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
          <div className="flex flex-col items-end justify-end">
            <p className="mt-1 text-sm text-gray-600">Price {price} </p>
            <p className="mt-1 text-sm text-gray-600">Order ID {order_id} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await dbConnect();

  const collegeid = context.params.collegeid;

  let orders = await Order.find({
    student_collegeid: collegeid,
  });

  let { student_name, student_email, student_phone } = orders[0];
  let student_info = { student_name, student_email, student_phone };

  let _tickets = [];
  let _order_ids = [];
  for (var i in orders) {
    for (var j in orders[i]["tickets"]) {
      let t = JSON.parse(JSON.stringify(orders[i]["tickets"][j]));
      t.order_id = orders[i]["_id"];

      _tickets.push(t);
    }
  }

  if (!orders) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const tickets = JSON.parse(JSON.stringify(_tickets));
    return { props: { tickets, collegeid, student_info } };
  }
}
