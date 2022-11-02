import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Layout({
  children,
  title = "This is the default title",
}) {
  const { data: session, status } = useSession();
  useEffect(() => {
    console.log({ session });
  }, [session]);
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="p-3 bg-indigo-500 header">
        {session ? (
          <>
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
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
