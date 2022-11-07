import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function DeleteOrder() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const contentType = "application/json";
  const router = useRouter();

  // const postData = async (data) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/event", {
  //       method: "POST",
  //       headers: {
  //         Accept: contentType,
  //         "Content-Type": contentType,
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     console.log(res);

  //     if (!res.ok) {
  //       console.log(res.error);
  //       throw new Error(res.status);
  //     }
  //     if (res.ok) {
  //       alert("Event Added");
  //       window.location.reload(false);
  //     }
  //     setLoading(false);

  //     // router.push('/')
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //   }
  // };

  const handleInput = (event) => {
    let inputname = event.target.name;
    let value = event.target.value;

    if (inputname != null && value != null) {
      let temp = data;
      temp[inputname] = value;
      setData(temp);
    }
  };

  const formValidate = (field, formData) => {
    if (field in formData) return true;
    return false;
  };

  const handleOrderDelete = () => {
    console.log(data);

    let fields = ["orderid"];

    for (let x = 0; x < fields.length; x += 1)
      if (!formValidate(fields[x], data)) {
        alert(`missing ${fields[x]}`);
        return;
      }
  };

  return (
    <Layout title={"ADMIN Delete"} access={"admin"}>
      <div className="flex justify-center items-center min-h-[75vh] w-[100vw]">
        <div className="mt-10 sm:mt-0 lg:w-[70%] mx-auto p-10">
          <div className="my-6 md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Delete Order
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Delete an Order and corresponding tickets
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Order ID
                      </label>
                      <input
                        type="text"
                        name="orderid"
                        id="orderid"
                        onChange={handleInput}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end py-3 text-right items-centerpx-4 bg-gray-50 sm:px-6">
                  <button
                    type="submit"
                    disabled
                    onClick={handleOrderDelete}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                  {loading && (
                    <div role="status" className="mx-2">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
