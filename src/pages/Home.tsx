import nodeLogo from "../assets/node.svg";
import { useState } from "react";
import "../App.scss";
import { Link } from "react-router-dom";

console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Link to={'/login'}>Login</Link>
      <div>
        <a
          href="https://github.com/electron-vite/electron-vite-react"
          target="_blank"
        >
          <img
            src="./electron-vite.svg"
            className="logo"
            alt="Electron + Vite logo"
          />
        </a>
      </div>
      <h1 className="text-blue-600">Electron + Vite + React + Scss</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Electron + Vite logo to learn more
      </p>
      <div className="flex-center">
        Place static files into the<code>/public</code> folder{" "}
        <img style={{ width: "5em" }} src={nodeLogo} alt="Node logo" />
      </div>
    </div>
  );
}

export default Home;
