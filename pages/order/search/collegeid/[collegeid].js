import { useEffect, useRef, useState } from "react";
import Layout from "../../../../components/Layout";

export default function CollegeIdOrders({ collegeid }) {
  const [da, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/order/collegeid/${collegeid}`)
      .then((res) => res.json())
      .then((da) => {
        setData(da);
        setLoading(false);
        console.log(da);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!da) return <p>No data</p>;

  return (
    <Layout>
      <div className=" w-full md:w-[50vw] overflow-hidden">
        <h1 className="mb-4 text-3xl font-extrabold text-center text-gray-900 dark:text-white md:text-5xl lg:text-3xl">
          <div className="text-5xl text-transparent py-9 bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            All Orders of {collegeid}
          </div>
        </h1>
        <div className="shadow-md sm:rounded-lg">
          {Object.keys(da.data).map((keyName, i) => (
            <>
              <h4 className="text-2xl font-bold text-center dark:text-white">
                ORDER {da.data[i]._id}
              </h4>
              <div className="w-full p-2 my-5 text-sm text-left text-gray-500 border border-separate dark:text-gray-400 border-slate-400">
                <div className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 w-[90%]">
                  <tr>
                    <th className="p-0 py-3 md:px-6">
                      Payment Mode: {da.data[i].payment_mode}
                    </th>
                  </tr>
                  {da.data[i].transaction_id == null ? null : (
                    <tr>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        Transaction ID: {da.data[i].transaction_id}
                      </th>
                    </tr>
                  )}
                  <tr>
                    <th scope="col" className="p-0 py-3 md:px-6">
                      Student Email: {da.data[i].student_email}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="p-0 py-3 md:px-6">
                      Student Collegeid:{da.data[i].student_collegeid}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="p-0 py-3 md:px-6">
                      Student Name: {da.data[i].student_name}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="p-0 py-3 md:px-6">
                      Student Phone:{da.data[i].student_phone}
                    </th>
                  </tr>
                </div>

                {Object.keys(da.data[i].tickets).map((k, index) => (
                  <div key={index} className="p-5 my-4 ">
                    <h4 className="my-4 text-2xl font-bold text-blue-600/100">
                      Ticket {da.data[i].tickets[k]._id}
                    </h4>
                    <h4 className="text-2xl font-bold dark:text-white">
                      Participants Data
                    </h4>
                    {Object.keys(da.data[i].tickets[k].participants).map(
                      (key, ind) => (
                        <>
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th
                              scope="row"
                              className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                            >
                              Participant {ind + 1}s Email
                            </th>
                            <th className="p-0 py-3 md:px-6">
                              {
                                da.data[i].tickets[index].participants[ind]
                                  ?.email
                              }
                            </th>
                          </tr>
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th
                              scope="row"
                              className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                            >
                              Participant {ind + 1}s Collegeid
                            </th>
                            <th className="p-0 py-3 md:px-6">
                              {
                                da.data[i].tickets[index].participants[ind]
                                  ?.collegeid
                              }
                            </th>
                          </tr>
                        </>
                      )
                    )}
                    <h4 className="text-2xl font-bold dark:text-white">
                      Event Detail
                    </h4>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Event Name
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.name}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Department Name
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.department}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Description
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.description}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Date
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.date}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Price
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.price}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Type
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.type}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="p-0 py-1 m-1 font-medium text-gray-900 md:px-6 whitespace-nowrap dark:text-white"
                      >
                        Event Code
                      </th>
                      <th scope="col" className="p-0 py-3 md:px-6">
                        {da.data[i].tickets[index].events.eventCode}
                      </th>
                    </tr>
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const collegeid = context.params.collegeid;

  if (!collegeid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return { props: { collegeid } };
  }
}
