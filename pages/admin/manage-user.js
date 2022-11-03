import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function AddEvent() {
  const [data, setData] = useState({});
  const [users, setUsers] = useState(null);
  const contentType = "application/json";
  const router = useRouter();

  const fetchUsers = async () => {
    let res = await fetch("/api/user");
    let data = await res.json();
    setUsers(data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log({ users });
  }, [users]);

  const deleteData = async (data) => {
    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(data),
      });
      console.log(res);

      if (!res.ok) {
        console.log(res.error);
        throw new Error(res.status);
      }

      if (res.ok) {
        alert("user deleted");
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async (data) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(data),
      });

      console.log(res);

      if (!res.ok) {
        console.log(res.error);
        throw new Error(res.status);
      }

      if (res.ok) {
        alert("user added");
        window.location.reload(false);
      }

      // router.push('/')
    } catch (error) {
      console.log(error);
    }
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

  const formValidate = (field, formData) => {
    if (field in formData) return true;
    return false;
  };

  const handleDelete = () => {
    deleteData({ username: data["delete_username"] });
  };

  const handleSubmit = () => {
    console.log(data);

    let fields = ["username", "password", "access"];

    for (let x = 0; x < fields.length; x += 1)
      if (!formValidate(fields[x], data)) {
        alert(`missing ${fields[x]}`);
        return;
      }

    // console.log(data)
    postData(data);
  };

  return (
    <Layout title={"ADMIN | Manage User"} access={"admin"}>
      <div className="flex flex-col justify-center items-center min-h-[100vh] w-[100vw]">
        <div className="mt-10 sm:mt-0 lg:w-[70%] mx-auto p-10">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add User
                </h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={handleInput}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        id="password"
                        onChange={handleInput}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Access
                      </label>
                      <select
                        id="access"
                        name="access"
                        onChange={handleInput}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>desk</option>
                        <option>admin</option>
                        <option>volunteer</option>
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

        <div className="mt-10 sm:mt-0 lg:w-[70%] mx-auto p-10">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Delete User
                </h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="delete_username"
                        id="delete_username"
                        onChange={handleInput}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    type="submit"
                    onClick={handleDelete}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0 lg:w-[70%] mx-auto p-10">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  All Users
                </h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Username (access)
                      </label>
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                    </div>
                    {users &&
                      users.map((user, index) => {
                        return (
                          <>
                            <div className="col-span-3 sm:col-span-3">
                              {/* <label className="block text-sm font-medium text-gray-700">
                                Username
                              </label> */}
                              <input
                                type="text"
                                value={`${user.username} (${user.access})`}
                                disabled
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-3 sm:col-span-3">
                              {/* <label className="block text-sm font-medium text-gray-700">
                                Username
                              </label> */}
                              <input
                                type="text"
                                value={user.password}
                                disabled
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </>
                        );
                      })}
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
