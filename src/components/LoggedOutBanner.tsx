import { signIn } from "next-auth/react";

const LoggedOutBanner = () => {
  return (
    <div className="fixed bottom-0 w-full bg-primary p-4">
      <p>Do not miss out</p>
      <div>
        <button onClick={() => signIn()}>Login</button>
      </div>
    </div>
  );
};

export default LoggedOutBanner;
