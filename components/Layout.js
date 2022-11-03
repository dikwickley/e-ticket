import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

export default function Layout({
  children,
  title = "e-ticket",
  access = null,
}) {
  const { data: session, status } = useSession();
  useEffect(() => {
    console.log(session);
  }, [session]);
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="px-5 p-3 bg-indigo-500 header  w-[100%] text-white">
        {session ? (
          // <>
          // Signed in as {session.user.username} <br />
          //   {session.user.access == "admin" && (
          //     <>
          //       <div className="m-2">
          //         <Link href="/admin/add-event">Add Event</Link>
          //       </div>
          //       <div className="m-2">
          //         <Link href="/admin/add-user">Add User</Link>
          //       </div>
          //     </>
          //   )}
          // <div className="m-2">
          //   <button onClick={() => signOut()}>Sign out</button>
          // </div>
          // </>
          <div className="flex flex-row flex-wrap justify-between">
            <div className="flex flex-col items-center lg:flex-row">
              <div>
                Signed in as{" "}
                <label className="font-extrabold">
                  {session.user.username}
                </label>{" "}
              </div>
              <div className="mx-1">
                <button
                  className="px-3 py-1 mx-2 font-bold text-black bg-white rounded-full"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-wrap lg:items-center lg:flex-row">
              <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                <Link href="/">Home</Link>
              </div>
              <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                <Link href="/order">Add Order</Link>
              </div>
              {session.user.access == "admin" && (
                <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                  <Link href="/admin/add-event">Add Event</Link>
                </div>
              )}
              {session.user.access == "admin" && (
                <div className="hidden px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer lg:block">
                  <Link href="/api/event">View Event</Link>
                </div>
              )}
              {session.user.access == "admin" && (
                <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                  <Link href="/admin/add-user">Add User</Link>
                </div>
              )}
              {session.user.access == "admin" && (
                <div className="hidden px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer lg:block">
                  <Link href="/api/user">View User</Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <button
              className="px-3 py-1 font-bold text-black bg-white rounded-full"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          </>
        )}
      </div>

      <div className="main flex flex-row min-h-[75vh] min-w-[100vw] justify-center items-center">
        {/* {(childern, session, access) => {
          if (access == null) return childern;

          if (session.user.access == "admin") return childern;

          if (session.user.access == "desk" && access == "desk")
            return childern;

          return <div>not authorized</div>;
        }} */}
        {session && session.user.access == "admin" && children}
        {session &&
          access == "desk" &&
          session.user.access == "desk" &&
          children}
      </div>
      {/* <footer>{"I`m here to stay"}</footer> */}
    </div>
  );
}
