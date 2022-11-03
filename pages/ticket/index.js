import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Event from "../../models/Event.model";
import dbConnect from "./../../util/db";
import Layout from "../../components/Layout";

export default function Ticket({ events }) {
  const [data, setData] = useState({});
  const [participants, setParticipants] = useState({});
  const [order, setOrder] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalOrder, setTotalOrder] = useState(0);
  const [transection, setTransection] = useState(false);

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
        throw new Error(res.status);
      }
      if ((res.success = true)) {
        alert("Ticket Created");
        window.location.reload(false);
      }
    } catch (error) {
      // console.log(error);
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
      setTransection(true);
    } else if (data.payment_mode === "Offline") {
      console.log("before", data.tarnsection_id);
      setTransection(false);
      data.tarnsection_id = "";
    } else if (data.payment_mode === "none") {
      setTransection(false);
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

  return (
    <Layout title={"Create Ticket"} access={"desk"}>
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
                  Create Ticket
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Create a new ticket using this form
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
                          placeholder="FirstName LastName"
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
                    {transection ? (
                      <>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Enter Transection Id
                          </label>
                          <input
                            ref={fieldRef}
                            type="text"
                            name="tarnsection_id"
                            id="tarnsection_id"
                            onChange={handleInput}
                            placeholder="Enter the transection id "
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
                  <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                    {currentEvent != null && (
                      <button
                        type="submit"
                        onClick={handleAdd}
                        className="inline-flex justify-center px-4 py-2 mr-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Add Event
                      </button>
                    )}
                    <button
                      type="submit"
                      onClick={() => setShowModal(true)}
                      className="inline-flex justify-center px-4 py-2 mr-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      View Order
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Create Ticket
                    </button>
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
