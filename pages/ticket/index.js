import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Event from "../../models/Event.model";
import dbConnect from "./../../util/db";

export default function Ticket({ events }) {
  const fieldRef = useRef(null);
  const [data, setData] = useState({});
  const [participants, setParticipants] = useState({});
  const [order, setOrder] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const contentType = "application/json";
  const router = useRouter();

  useEffect(() => {
    console.log(order);
  }, [order]);

  const postData = async (data) => {
    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(data),
      });

      console.log(res);

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      // router.push('/')
    } catch (error) {
      console.log(error);
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

    console.log(data);
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
    console.log(participants);
  };

  const handleSelectEvent = (e) => {
    setCurrentEvent(events[e.target.value]);
  };

  const handleAdd = () => {
    setOrder([...order, { participants: participants, event: currentEvent }]);

    clearFields();
  };

  const formValidate = (field, formData) => {
    if (field in formData)
      if (formData[field] === null || formData[field] === "") return false;
      else return true;
    return false;
  };

  const handleSubmit = () => {
    let temp = data;
    temp = { ...data, order: order };
    setData(temp);
    console.log(data);
    
    let fields = ["student_name", "student_phone"];

    for (let x = 0; x < fields.length; x += 1)
      if (!formValidate(fields[x], temp)) {
        alert(`missing ${fields[x]}`);
        return;
    }
    data['issue_date'] = new Date()
    postData(data);

    //reload window
  };

  return (
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
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  }

                  <div className="col-span-6 sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Event
                    </label>
                    <select
                      id="event"
                      name="event"
                      onChange={handleSelectEvent}
                      className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                              onChange={(e) => {
                                handleParticipant(e, i);
                              }}
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                      // onClick={}
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
