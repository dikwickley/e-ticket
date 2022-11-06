import { useEffect, useRef, useState } from "react";

export default function ViewOrder() {
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
    <>
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-3xl text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Total Order Data
        </span>
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        {Object.keys(da.data).map((keyName, i) => (
          <>
            <h4 className="text-2xl font-bold dark:text-white text-center">
              {i + 1} ORDER
            </h4>
            <table className="w-full mx-5 my-5 text-sm text-left text-gray-500 border border-separate dark:text-gray-400 border-slate-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Payment Mode
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {da.data[i].payment_mode}
                  </th>
                </tr>
                {da.data[i].transaction_id == null ? null : (
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].transaction_id}
                    </th>
                  </tr>
                )}
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {da.data[i].student_email}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Collegeid
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {da.data[i].student_collegeid}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {da.data[i].student_name}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {da.data[i].student_phone}
                  </th>
                </tr>
              </thead>

              {Object.keys(da.data[i].tickets).map((k, index) => (
                <>
                  <h4 className="text-2xl font-bold text-blue-600/100 text-right">
                    {index + 1} Ticket Data &nbsp;
                  </h4>
                  <h4 className="text-2xl font-bold dark:text-white">
                    &nbsp;{index + 1} Tickets Participants Data :{" "}
                  </h4>
                  {Object.keys(da.data[i].tickets[0].participants).map(
                    (key, ind) => (
                      <>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            Participant {ind + 1}s Email
                          </th>
                          <th className="px-6 py-3">
                            {da.data[i].tickets[index].participants[ind].email}
                          </th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            Participant {ind + 1}s Collegeid
                          </th>
                          <th className="px-6 py-3">
                            {
                              da.data[i].tickets[index].participants[ind]
                                .collegeid
                            }
                          </th>
                        </tr>
                      </>
                    )
                  )}
                  <h4 className="text-2xl font-bold dark:text-white">
                    &nbsp; {index + 1} Tickets Event Detail :{" "}
                  </h4>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Event Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.name}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Department Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.department}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.description}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.date}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.price}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.type}
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Event Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {da.data[i].tickets[index].events.eventCode}
                    </th>
                  </tr>
                </>
              ))}
            </table>
          </>
        ))}
      </div>
    </>
  );
}
