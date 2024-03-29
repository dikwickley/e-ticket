import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Event from "../../models/Event.model";
import dbConnect from "../../util/db";
import Layout from "../../components/Layout";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Order({ events }) {
  const { data: session, status } = useSession();
  const [data, setData] = useState({});
  const [participants, setParticipants] = useState({});
  const [order, setOrder] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalOrder, setTotalOrder] = useState(0);
  const [transaction, setTransaction] = useState(false);
  const [loading, setLoading] = useState(false);

  const contentType = "application/json";
  const router = useRouter();
  const fieldRef = useRef(null);
  useEffect(() => {
    setTotalOrder(0);
    console.log("Order", order);
    console.log("Length", order.length);
    for (let i = 0; i < order.length; i += 1) {
      console.log("in for loop");
      console.log(`Here ${i}`, order[i].event.price);
      setTotalOrder(totalOrder + order[i].event.price);
    }
  }, [order]);

  //regex pattern
  const re_st = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
  const re_email =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const re_ph =
    /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;
  const re_id = /^[0-9]{2}[a-zA-Z]{2}[0-9]{3}$/;

  const postData = async (data) => {
    setLoading(true);
    console.log("post data", data);
    data["issue_date"] = new Date();
    data["order_taken_by"] = session.user.username;
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(data),
      });

      //console.log(res);

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        alert("some error occured. contact admin.");
        setLoading(false);
        throw new Error(res.status);
      }
      if ((res.success = true)) {
        alert("Ticket Created");
        setLoading(false);
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const clearFields = () => {
    // document.getElementById("student_name").value = "";
    // document.getElementById("student_phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("collegeid").value = "";
    document.getElementById("event").selectedIndex = 0;
    setParticipants({});
    setCurrentEvent(null);
  };

  function convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const handleInput = (event) => {
    let inputname = event.target.name;
    let value = event.target.value;

    if (inputname != null && value != null) {
      let temp = data;
      temp[inputname] = value;
      setData(temp);
    }
    console.log(data.payment_mode);
    if (data.payment_mode === "Online") {
      setTransaction(true);
    } else if (data.payment_mode === "Offline") {
      console.log("before", data.tarnsection_id);
      setTransaction(false);
      data.tarnsection_id = "";
    } else if (data.payment_mode === "none") {
      setTransaction(false);
      alert("Please Select a Payment method.");
    }
  };

  const handleParticipant = (event, index) => {
    let inputname = event.target.name;
    let value = event.target.value;
    let temp = participants;
    if (index in temp) {
      temp[index][inputname] = value;
    } else {
      temp[index] = {};
      temp[index][inputname] = value;
    }
    setParticipants(temp);
    //console.log("Participants are : ",participants);
  };

  const handleSelectEvent = (e) => {
    setCurrentEvent(events[e.target.value]);
    console.log("Value of event is : ", e.target.value);
  };

  const handleAdd = () => {
    const bool = true;
    Object.entries(participants).map(([key, val]) => {
      if (!re_email.test(val.email)) {
        bool = false;
        alert(`Invalid Email : ${val.email}`);
      }
      if (!re_id.test(val.collegeid)) {
        bool = false;
        alert(`Invalid id : ${val.collegeid}`);
      }
    });
    if (bool) {
      setOrder([...order, { participants: participants, event: currentEvent }]);
      clearFields();
    }
  };

  const formValidate = (field, formData) => {
    if (field in formData)
      if (formData[field] === null || formData[field] === "") return false;
      else return true;
    return false;
  };

  const handleSubmit = (e) => {
    let temp = data;
    temp = { ...data, order: order };
    setData(temp);
    console.log("Main", data);
    if (
      temp["student_name"] &&
      temp["student_email"] &&
      temp["student_phone"] &&
      data.payment_mode
    ) {
      //validation part
      if (!re_st.test(temp["student_name"])) {
        alert("Invalid name given");
      } else if (!re_email.test(temp["student_email"])) {
        alert("Invalid Email");
      } else if (!re_ph.test(temp["student_phone"])) {
        alert("Invali Phone Number");
      } else if (data.payment_mode === "None") {
        alert("Please select a payment mode");
      } else {
        //alert(temp["student_name"]);
        let fields = ["student_name", "student_email", "student_phone"];
        for (let x = 0; x < fields.length; x += 1)
          if (!formValidate(fields[x], temp)) {
            alert(`missing ${fields[x]}`);
            return;
          }
        if (temp.order.length == 0) {
          alert(`missing order`);
          return;
        }
        data["issue_date"] = new Date();
        postData(temp);
      }
    } else {
      alert("All fields are required!");
    }
  };

  const redirect = () => {
    router.push("/viewOrder");
  };

  return (
    <Layout title={"Create Order"} access={"desk"}>
      {/* MODAL STARTS */}
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              {/*content*/}
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold ">Verify Order</h3>
                  <button
                    className="float-right p-1 ml-auto text-3xl font-semibold leading-none bg-transparent border-0 outline-none opacity-100 text-red focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span
                      className="block w-6 h-6 text-2xl bg-transparent outline-none text-red focus:outline-none"
                      style={{ color: "red" }}
                    >
                      X
                    </span>
                  </button>
                </div>

                {/* table started */}
                <div className="flex flex-col">
                  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-4 sm:px-6 lg:px-8">
                      <div className="overflow-hidden">
                        <table className="min-w-full text-center">
                          <tr className="bg-gray-800 border-b">
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              Student Name
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              Student Email
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              Student Phone
                            </td>
                          </tr>

                          <tr className="bg-white border-b">
                            <td className="px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap">
                              {data.student_name}
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap">
                              {data.student_email}
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap">
                              {data.student_phone}
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-4 sm:px-6 lg:px-8">
                      <div className="overflow-hidden">
                        <table className="min-w-full text-center">
                          <tr className="bg-gray-800 border-b">
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              Payment Method
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              {data.payment_mode}
                            </td>
                          </tr>
                          <tr className="bg-gray-800 border-b">
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              Order Total
                            </td>
                            <td className="px-6 py-4 text-base font-medium text-white whitespace-nowrap">
                              {totalOrder}
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* table ended */}
                {order.map((value, index) => {
                  return (
                    <>
                      <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full py-4 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                              <table className="min-w-full text-center">
                                <thead className="bg-gray-800 border-b">
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="px-6 py-4 text-lg font-medium text-center text-white whitespace-nowrap"
                                    >
                                      {value.event.name} ( price ={" "}
                                      {value.event.price} )
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-indigo-100 border-b border-indigo-200">
                                    <td className="px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap">
                                      ID
                                    </td>
                                    <td className="px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap">
                                      Email
                                    </td>
                                  </tr>

                                  {/* Fetching the data of participants */}
                                  {Object.entries(value.participants).map(
                                    ([key, val]) => {
                                      return (
                                        <>
                                          <tr className="bg-white border-b">
                                            <td className="px-6 py-4 text-base text-gray-900 font-lg whitespace-nowrap">
                                              {val.collegeid}
                                            </td>
                                            <td className="px-6 py-4 text-base text-gray-900 font-lg whitespace-nowrap">
                                              {val.email}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
      {/*  ***************** */}
      {/* ***Ticket Page stated*** */}
      <div className="flex justify-center items-center min-h-[100vh] w-[100vw]">
        <div className="mt-10 sm:mt-0 lg:w-[70%] mx-auto p-10">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create Order
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Create a new orders using this form
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    {
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Student Name
                        </label>
                        <input
                          ref={fieldRef}
                          type="text"
                          name="student_name"
                          id="student_name"
                          onChange={handleInput}
                          placeholder="Full Name"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    }
                    {
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Student Collegeid
                        </label>
                        <input
                          ref={fieldRef}
                          type="text"
                          name="student_collegeid"
                          id="student_collegeid"
                          onChange={handleInput}
                          placeholder="example 20it433"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    }
                    {
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Student Email
                        </label>
                        <input
                          ref={fieldRef}
                          type="text"
                          name="student_email"
                          id="student_email"
                          onChange={handleInput}
                          placeholder="example12@gmail.com"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    }
                    {
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Student Phone
                        </label>
                        <input
                          ref={fieldRef}
                          type="text"
                          name="student_phone"
                          id="student_phone"
                          onChange={handleInput}
                          placeholder="10 digit phone number"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    }
                    {
                      <div className="col-span-6 sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Method
                        </label>
                        <select
                          id="payment_mode"
                          name="payment_mode"
                          onChange={handleInput}
                          //onChange={()=>{handleInput();handleSelectEvent()}}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="None">None</option>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                    }
                    {transaction ? (
                      <>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Enter transaction Id
                          </label>
                          <input
                            ref={fieldRef}
                            type="text"
                            name="transaction_id"
                            id="transaction_id"
                            onChange={handleInput}
                            placeholder="Enter the transaction id "
                            className="block mt-1 border-gray-300 rounded-md shadow-sm w-96 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                      </>
                    ) : null}
                    <div className="col-span-6 sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Event
                      </label>
                      <select
                        id="event"
                        name="event"
                        onChange={handleSelectEvent}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        required
                      >
                        <option>None</option>
                        {events.map((event, index) => {
                          return (
                            <option key={index} value={`${index}`}>
                              {event.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {currentEvent != null && (
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Event Date
                        </label>
                        <input
                          disabled
                          type="text"
                          name="name"
                          id="name"
                          value={convertDate(currentEvent.date)}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}

                    {currentEvent != null && (
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Event Price
                        </label>
                        <input
                          disabled
                          type="text"
                          name="name"
                          id="name"
                          value={currentEvent.price}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {currentEvent != null && (
            <div className="mt-5 md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Add Participants
                  </h3>
                  <p className="mt-1 text-sm text-gray-600"></p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      {currentEvent != null &&
                        [...Array(currentEvent.type)].map((e, i) => (
                          <div key={i} className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Participant {i + 1}
                            </label>
                            <div className="col-span-6 sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                ID number
                              </label>
                              <input
                                ref={fieldRef}
                                type="text"
                                name="collegeid"
                                id="collegeid"
                                onChange={(e) => {
                                  handleParticipant(e, i);
                                }}
                                placeholder="example 20it433"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">
                                email
                              </label>
                              <input
                                ref={fieldRef}
                                type="text"
                                name="email"
                                id="email"
                                placeholder="example12@gmail.com"
                                onChange={(e) => {
                                  handleParticipant(e, i);
                                }}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900"></h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="flex flex-row flex-wrap items-center justify-start px-4 py-3 text-right bg-gray-50 sm:px-6">
                    {currentEvent != null && (
                      <button
                        type="submit"
                        onClick={handleAdd}
                        className="inline-flex justify-center px-4 py-2 my-1 mr-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Add Event
                      </button>
                    )}
                    <button
                      type="submit"
                      onClick={() => setShowModal(true)}
                      className="inline-flex justify-center px-4 py-2 my-1 mr-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      View Order
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        window.location.reload(false);
                      }}
                      className="inline-flex justify-center px-4 py-2 my-1 mr-4 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Reset
                    </button>

                    {/* <button
                      type="submit"
                      onClick={redirect}
                      className="inline-flex justify-center px-4 py-2 my-1 mr-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Total Order
                    </button> */}

                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading ? true : false}
                      className={`inline-flex justify-center px-4 py-2 my-1 text-sm font-medium text-white ${
                        loading ? "bg-gray-500" : "bg-green-600"
                      } border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      Create Ticket
                    </button>
                    {loading && (
                      <div role="status" className="mx-2">
                        <svg
                          aria-hidden="true"
                          className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Event.find({});

  const events = result.map((doc) => {
    const event = doc.toObject();
    event._id = event._id.toString();
    event.date = event.date.toString();
    return event;
  });

  return { props: { events: events } };
}
