import "./header.css";

export const Header = () => {
  return (
    <>
      <div className="container header">
        <span className="logo">Ma'rifah</span>
        <ul className="navbar">
          <li>
            <a href="#Home">Home</a>
          </li>
          <li>
            <a href="#About">About</a>
          </li>
          <li>
            <a href="#Academic-Support">Academic Support</a>
          </li>
          <li>
            <a href="#Q&A">Q & A</a>
          </li>
          <li>
            <a href="#Contact-us">Contact us</a>
          </li>
          <li>
            <a href="#Login">Login</a>
          </li>
        </ul>
      </div>
    </>
  );
};
