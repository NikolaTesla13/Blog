import React, { useState } from "react";

export default function BlogHeader() {
  const [menuOpened, setMenuOpened] = useState(false);
  const changeTheme = (theme) => {
    const previousTheme = localStorage.getItem("theme");
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove(previousTheme);
    document.documentElement.classList.add(theme);
  };

  return (
    <header className="wrapper">
      <div className="article">
        <h1>
          <a href="/" style={{ fontWeight: "bold" }}>
            <span>Stefan Asandei</span>
          </a>
        </h1>
        <div className="row">
          <h1>
            <a href="/blog" className="not-selected">
              <span>Blog</span>
            </a>
          </h1>
          <button onClick={() => setMenuOpened(!menuOpened)}>
            <h1 suppressHydrationWarning>
              theme{" "}
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
            <button onClick={() => changeTheme("nord")}>nord</button>
            <button onClick={() => changeTheme("solarized")}>solarized</button>
          </div>
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
