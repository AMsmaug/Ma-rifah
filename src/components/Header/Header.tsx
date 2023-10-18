import "./header.css";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export const Header = () => {
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  console.log(open);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setanchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setanchorEl(null);
  };
  return (
    <>
      <div className="container header">
        <span className="logo">Ma'rifah</span>
        <ul className="navbar">
          <li>
            <a href="#Home">Home</a>
          </li>
          <li onClick={handleClick} className="sections-list">
            <a href="#">Sections</a>
          </li>
          <div className="sections">
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
          </div>

          <li>
            <a href="/login">Login</a>
          </li>
          <Menu
            id="sections"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            className="sections"
          >
            <MenuItem component="li">
              <a href="#About">About</a>
            </MenuItem>
            <MenuItem component="li">
              <a href="#Academic-Support">Academic Support</a>
            </MenuItem>
            <MenuItem component="li">
              <a href="#Q&A">Q & A</a>
            </MenuItem>
            <MenuItem component="li">
              <a href="#Contact-us">Contact us</a>
            </MenuItem>
          </Menu>
        </ul>
      </div>
    </>
  );
};
