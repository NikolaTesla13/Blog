import React, { useState } from "react";
import useWindowDimensions from "../hooks/windowDimensions";

export default function BlogHeader() {
  const [menuOpened, setMenuOpened] = useState(false);
  const changeTheme = (theme) => {
    const previousTheme = localStorage.getItem("theme");
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove(previousTheme);
    document.documentElement.classList.add(theme);
  };
  const { height, width } = useWindowDimensions();

  return (
    <header className="wrapper">
      <div className="article">
        <h1>
          {width < 700 ? (
            <a href="/" style={{ fontWeight: "bold" }}>
              <span>Stefan</span>
            </a>
          ) : (
            <a href="/" style={{ fontWeight: "bold" }}>
              <span>Stefan Asandei</span>
            </a>
          )}
        </h1>
        <div className="row">
          <h1>
            <a href="/blog" className="not-selected">
              <span>Blog</span>
            </a>
            <a href="/webring" className="not-selected webring">
              <span>Webring</span>
            </a>
          </h1>
          <button onClick={() => setMenuOpened(!menuOpened)}>
            <h1 suppressHydrationWarning>
              theme
              <span style={{ transform: `scaleY(${menuOpened ? -1 : 1})` }}>
                ▼
              </span>
            </h1>
          </button>
          <div
            className="dropdownMenu"
            style={{ display: `${menuOpened ? "" : "none"}` }}
          >
            <button onClick={() => changeTheme("dracula")}>dracula</button>
            <button onClick={() => changeTheme("gruvbox")}>gruvbox</button>
            <button onClick={() => changeTheme("nord")}>nord</button>
            <button onClick={() => changeTheme("solarized")}>solarized</button>
            <button onClick={() => changeTheme("blackpink")}>blackpink</button>
          </div>
          {/* {width > 700 ? (
            <button onClick={() => (window.location = "/login")}>
              <h1 suppressHydrationWarning>Log in</h1>
            </button>
          ) : (
            <></>
          )} */}
          {/* <!-- <h1>
              <a href="/projects" class="not-selected">
                <span>Projects</span>
              </a>
            </h1>
            <h1>
              <a href="/contact" class="not-selected">
                <span>Contact</span>
              </a>
            </h1> --> */}
        </div>
      </div>
    </header>
  );
}
