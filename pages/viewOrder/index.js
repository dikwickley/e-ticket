import { useEffect, useRef, useState } from "react";
export default function viewOrder() {
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
      <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-3xl text-center">
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Total Order Data
        </span>
      </h1>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg ">
        {Object.keys(da.data).map((keyName, i) => (
          <>
            <h4 class="text-2xl font-bold dark:text-white text-center">
              {i + 1} ORDER
            </h4>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-5 my-5 border-separate border border-slate-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Payment Mode
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {da.data[i].payment_mode}
                  </th>
                </tr>
                {da.data[i].transaction_id == null ? null : (
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Transaction ID
                    </th>
                    <th scope="col" className="py-3 px-6">
                      {da.data[i].transaction_id}
                    </th>
                  </tr>
                )}
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Student Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {da.data[i].student_email}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Student Collegeid
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {da.data[i].student_collegeid}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Student Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {da.data[i].student_name}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Student Phone
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {da.data[i].student_phone}
                  </th>
                </tr>
              </thead>

              {Object.keys(da.data[i].tickets).map((k, index) => (
                <>
                
                      <h4 class="text-2xl font-bold text-blue-600/100 text-right">
                      {index + 1} Ticket Data &nbsp;
                      </h4>
                  <h4 class="text-2xl font-bold dark:text-white">
                    &nbsp;{index + 1} Ticket's Participants Data :{" "}
                  </h4>
                  {Object.keys(da.data[i].tickets[0].participants).map(
                    (key, ind) => (
                      <>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            Participant {ind + 1}'s Email
                          </th>
                          <th className="py-3 px-6">
                            {da.data[i].tickets[index].participants[ind].email}
                          </th>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            Participant {ind + 1}'s Collegeid
                          </th>
                          <th className="py-3 px-6">
                            {da.data[i].tickets[index].participants[ind].collegeid}
                          </th>
                        </tr>
                      </>
                    )
                  )}
                   <h4 class="text-2xl font-bold dark:text-white">
                &nbsp; {index+1} Ticket's Event Detail :{" "}
              </h4>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Event Name
                </th>
                <th scope="col" className="py-3 px-6">
                  {da.data[i].tickets[index].events.name}
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Department Name
                </th>
                <th scope="col" className="py-3 px-6">
                  {da.data[i].tickets[index].events.department}
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Description
                </th>
                <th scope="col" className="py-3 px-6">
                  {da.data[i].tickets[index].events.description}
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Date
                </th>
                <th scope="col" className="py-3 px-6">
                  {da.data[i].tickets[index].events.date}
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Price
                </th>
                <th scope="col" className="py-3 px-6">
                  {da.data[i].tickets[index].events.price}
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Type
                </th>
                <th scope="col" className="py-3 px-6">
                  {da.data[i].tickets[index].events.type}
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Event Code
                </th>
                <th scope="col" className="py-3 px-6">
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
