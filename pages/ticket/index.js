import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Event from '../../models/Event.model'
import dbConnect from './../../util/db'

export default function Ticket({events}) {

  const [data, setData] = useState({})
  const contentType = 'application/json'
  const router = useRouter()

  useEffect(()=>{
    console.log({events})
  },[])

  const postData = async (data) => {
    try {
      const res = await fetch('/api/event', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(data),
      })

      console.log(res)

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      

      // router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleInput = (event) => {
    let inputname = event.target.name
    let value = event.target.value

    if(inputname != null && value != null){
      let temp = data
      temp[inputname] = value
      setData(temp)
    }

  }

  const handleSelectEvent = (event) => {
    
  }

  const handleSubmit = () => {
    console.log(data)
    postData(data)
  }

  return (
    <div className="flex justify-center items-center h-[100vh] w-[100vw]">
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


                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="block text-sm font-medium text-gray-700"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      onChange={handleInput}
                      className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>None</option>
                      {
                        events.map((event, index) => {
                            return <option key={index} value={`${event._id}`}>{event.name}</option>
                        })
                      }

                    </select>
                  </div>

               
                </div>
              </div>
              <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
    await dbConnect()
  
    /* find all the data in our database */
    const result = await Event.find({})
    const events = result.map((doc) => {
      const event = doc.toObject()
      event._id = event._id.toString()
      event.date = event.date.toString()
      return event
    })
  
    return { props: { events: events } }
  }
