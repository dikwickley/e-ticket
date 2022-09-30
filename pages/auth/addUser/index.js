export default function Login() {
    return (
        <>
            <div className="font-serif antialiased bg-grey-lightest">

                {/* Content */}
                <div className="w-full bg-grey-lightest" style={{ paddingTop: "4rem" }}>
                    <div className="container mx-auto py-2">
                        <div className="w-5/6 lg:w-1/2 mx-auto bg-white rounded shadow">
                            <div className="py-4 px-8 text-black text-xl border-b border-grey-lighter font-extrabold">Add User Form</div>
                            <div className="py-4 px-8">
                                <div className="flex mb-4">
                                    <div className="w-1/2 mr-1">
                                        <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">User name</label>
                                        <input className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="first_name" type="text" placeholder="Enter User Name" />
                                    </div>
                                    <div className="w-1/2 ml-1">
                                        <label className="block text-grey-darker text-sm font-bold mb-2" for="last_name">ID</label>
                                        <input className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="last_name" type="text" placeholder="Enter User ID" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-grey-darker text-sm font-bold mb-2" for="email">Desk Number</label>
                                    <input className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" type="text" placeholder="Enter Desk Number" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-grey-darker text-sm font-bold mb-2" for="email">Contact Number</label>
                                    <input className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="tel" type="text" placeholder="Enter User Contact Number" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-grey-darker text-sm font-bold mb-2" for="password">Password</label>
                                    <input className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="password" type="password" placeholder="Your secure password" />
                                    <p className="text-grey text-xs mt-1">At least 6 characters</p>
                                </div>
                                <div className="mb-4">
                                    <button type="submit" class="w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Add user</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <footer className="w-full bg-grey-lighter py-8">
                    <div className="container mx-auto text-center px-8">
                        <p className="text-grey-dark mb-1 text-sm">This is <span className="font-bold">GENESIS</span> Product.</p>
                    </div>
                </footer>
            </div>
        </>
    )
}