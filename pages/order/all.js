import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";

export default function AllOrder() {
  const [da, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/order")
      .then((res) => res.json())
      .then((da) => {
        setData(da);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!da) return <p>No data</p>;

  return (
    <Layout access={"admin"} title={"All Orders"}>
      <div className="w-[70%] py-5">
        <h1 className="mb-4 text-3xl font-extrabold text-center text-gray-900 dark:text-white md:text-5xl lg:text-3xl">
          <span className="text-6xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Total Order Data
          </span>
        </h1>
        <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg">
          {Object.keys(da.data).map((keyName, i) => (
            <>
              <h4 className="text-2xl font-bold text-center dark:text-white">
                {i + 1} ORDER
              </h4>
              <table className="w-full p-10 mx-5 my-5 text-sm text-left text-gray-500 dark:text-gray-400 border-slate-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-xl">Payment Mode</th>
                    <th className="px-6 py-3 ">{da.data[i].payment_mode}</th>
                  </tr>
                  {da.data[i].transaction_id == null ? null : (
                    <tr>
                      <th className="px-6 py-3 text-xl">Transaction ID</th>
                      <th className="px-6 py-3 ">
                        {da.data[i].transaction_id}
                      </th>
                    </tr>
                  )}
                  <tr>
                    <th className="px-6 py-3 text-xl text-indigo-600">
                      Student Email
                    </th>
                    <th className="px-6 py-3 text-lg">
                      {da.data[i].student_email}
                    </th>
                  </tr>
                  <tr>
                    <th className="px-6 py-3">Student Collegeid</th>
                    <th className="px-6 py-3">
                      {da.data[i].student_collegeid}
                    </th>
                  </tr>
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">{da.data[i].student_name}</th>
                  </tr>
                  <tr>
                    <th className="px-6 py-3">Student Phone</th>
                    <th className="px-6 py-3">{da.data[i].student_phone}</th>
                  </tr>
                </thead>

                <h4 className="text-2xl font-bold dark:text-white">
                  &nbsp; Participants Data :{" "}
                </h4>

                {Object.keys(da.data[i].tickets[0].participants).map(
                  (key, ind) => (
                    <>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Participant {ind + 1} Email
                        </th>
                        <th className="px-6 py-3">
                          {da.data[i].tickets[0].participants[ind].email}
                        </th>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Participant {ind + 1} Collegeid
                        </th>
                        <th className="px-6 py-3">
                          {da.data[i].tickets[0].participants[ind].collegeid}
                        </th>
                      </tr>
                    </>
                  )
                )}

                <h4 className="text-2xl font-bold dark:text-white">
                  &nbsp; Events Detail :{" "}
                </h4>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Event Name
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.name}
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Department Name
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.department}
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Description
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.description}
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.date}
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Price
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.price}
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Type
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.type}
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Event Code
                  </th>
                  <th className="px-6 py-3">
                    {da.data[i].tickets[0].events.eventCode}
                  </th>
                </tr>
              </table>
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
}
