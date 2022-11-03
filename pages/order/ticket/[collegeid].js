import Order from "../../../models/Order.model";
import dbConnect from "../../../util/db";

export default function OrderTickets({ tickets, collegeid }) {
  console.log({ tickets });
  return <div>Tickets of {collegeid}</div>;
}

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
