"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("super.admin.demo@ois.local");

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("ois-console-demo-user", email);
    window.location.href = "/dashboard";
  }

  return (
    <main className="login">
      <form onSubmit={login}>
        <div className="demo">DEMO DATA - NOT PRODUCTION</div>
        <h1>OIS Console Login</h1>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Workspace
          <input value="PMC Org Demo" readOnly />
        </label>
        <button className="button" type="submit">
          Sign In
        </button>
      </form>
    </main>
  );
}
