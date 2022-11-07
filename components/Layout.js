import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({
  children,
  title = "e-ticket",
  access = null,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
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
      <div className="px-5 p-3 bg-indigo-500 header w-[100%] text-white ">
        {session ? (
          <div className="flex flex-row flex-wrap justify-between">
            <div className="flex flex-col items-center lg:flex-row">
              <div>
                <label className="font-extrabold">
                  {session.user.username} {`(${session.user.access})`}
                </label>{" "}
              </div>
              <div className="mx-1">
                <button
                  className="px-3 py-1 mx-2 font-bold text-black bg-white rounded-full"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-wrap lg:items-center lg:flex-row">
              <Link href="/">
                <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                  Home
                </div>
              </Link>

              {(session.user.access == "desk" ||
                session.user.access == "admin") && (
                <Link href="/order">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                    Add Order
                  </div>
                </Link>
              )}

              {session.user.access == "admin" && (
                <Link href="/order/search">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                    Search Orders
                  </div>
                </Link>
              )}

              {session.user.access == "admin" && (
                <Link href="/admin/add-event">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                    Add Event
                  </div>
                </Link>
              )}

              <Link href="/event">
                <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                  View Event
                </div>
              </Link>

              {session.user.access == "admin" && (
                <Link href="/admin/manage-user">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                    Manage User
                  </div>
                </Link>
              )}

              {session.user.access == "admin" && (
                <Link href="/admin/analytics">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                    Analytics
                  </div>
                </Link>
              )}

              {session.user.access == "admin" && (
                <Link href="/download">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                    Download
                  </div>
                </Link>
              )}

              {session.user.access == "admin" && (
                <Link href="/admin/delete-order">
                  <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-white bg-red-600 rounded-full cursor-pointer">
                    Delete Order
                  </div>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-between">
            <button
              className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer"
              onClick={() => signIn()}
            >
              Sign in
            </button>
            <div className="flex">
              <Link href="/">
                <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                  Home
                </div>
              </Link>
              <Link href="/event">
                <div className="px-5 py-1 mx-2 my-1 font-bold text-center text-black bg-white rounded-full cursor-pointer">
                  View Events
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="main flex flex-row min-h-[75vh]  justify-center items-center">
        {!access && children}

        {access && session && session.user.access == "admin" && children}
        {access &&
          session &&
          access == "desk" &&
          session.user.access == "desk" &&
          children}
      </div>
    </div>
  );
}
