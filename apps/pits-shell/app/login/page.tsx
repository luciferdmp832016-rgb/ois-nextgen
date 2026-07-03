"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("staff.demo@ois.local");

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("pits-demo-user", email);
    window.location.href = "/projects";
  }

  return (
    <main className="login">
      <form onSubmit={login}>
        <div className="demo">DEMO DATA - NOT PRODUCTION</div>
        <h1>PITS Login</h1>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Product
          <input value="PITS Project User" readOnly />
        </label>
        <button className="button" type="submit">
          Sign In
        </button>
      </form>
    </main>
  );
}
