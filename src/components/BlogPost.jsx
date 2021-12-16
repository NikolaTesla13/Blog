import Author from "./Author.astro";

export default function BlogPost({
  title,
  author,
  publishDate,
  heroImage,
  alt,
  children,
}) {
  return (
    <div className="layout">
      <article className="content">
        <div>
          <div className="header">
            {heroImage && (
              <img
                width="720"
                height="420"
                className="hero-image"
                loading="lazy"
                src={heroImage}
                alt={alt}
              />
            )}
            <p className="publish-date">{publishDate}</p>
            <h1 className="title">{title}</h1>
          </div>
          <main class="main">{children}</main>
        </div>
      </article>
    </div>
  );
}
