import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

export default function Layout({
  children,
  title = "This is the default title",
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
      <div className="p-3 bg-indigo-500 header absolute w-[100%]">
        {session ? (
          <>
            Signed in as {session.user.email} <br />
            {session.user.access == "admin" && (
              <>
                <div className="m-2">
                  <Link href="/admin/add-event">Add Event</Link>
                </div>
                <div className="m-2">
                  <Link href="/admin/add-user">Add User</Link>
                </div>
              </>
            )}
            <div className="m-2">
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </>
        ) : (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
      </div>

      <div className="main">{children}</div>
      {/* <footer>{"I`m here to stay"}</footer> */}
    </div>
  );
}
