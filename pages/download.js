import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Download() {
  const [data, setData] = useState({});
  const contentType = "application/json";
  const router = useRouter();

  const fetchByCode = async (code) => {
    const res = await fetch(`/api/order/ticket/${code}`);
  };

  const handleFetchByCode = () => {
    let eventCode = data["event_code"];
    fetchByCode(eventCode);
  };

  const handleInput = (event) => {
    let inputname = event.target.name;
    let value = event.target.value;

    if (inputname != null && value != null) {
      let temp = data;
      temp[inputname] = value;
      setData(temp);
    }
  };

  return (
    <Layout title={"ADMIN | Manage User"} access={"admin"}>
      <div className="flex flex-col justify-center items-center min-h-[100vh] w-[100vw]">
        <div className="mt-10 sm:mt-0 lg:w-[70%] mx-auto p-10">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Download Tickets
                </h3>
                <p className="mt-1 text-sm text-gray-600">by Event Code</p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Event Code
                      </label>
                      <input
                        type="text"
                        name="event_code"
                        id="event_code"
                        onChange={handleInput}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <Link href={`/api/ticket/event-code/${data["event_code"]}`}>
                    <a target="_blank">
                      <button
                        type="submit"
                        // onClick={handleFetchByCode}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Download
                      </button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
