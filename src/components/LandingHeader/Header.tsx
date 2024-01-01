import "./header.css";
import { Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ActiveContext } from "../Auth/UserInfo";

export const Header = () => {
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setanchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setanchorEl(null);
  };

  const navigate = useNavigate();

  const { setUserName, setProfileUrl } = useContext(ActiveContext);

  return (
    <>
      <div className="container header">
        <span className="logo">Ma'rifah</span>
        <ul className="navbar">
          <li>
            <a className="option" href="/#Home">
              Home
            </a>
          </li>
          <li onClick={handleClick} className="sections-list">
            <a className="option" href="#">
              Sections
            </a>
          </li>
          <div className="sections">
            <li>
              <a className="option" href="/#About">
                About
              </a>
            </li>
            <li>
              <a className="option" href="/#Academic-Support">
                Academic Support
              </a>
            </li>
            <li>
              <a className="option" href="/#Q&A">
                Q & A
              </a>
            </li>
            <li>
              <a className="option" href="/#Contact-us">
                Contact us
              </a>
            </li>
          </div>
          <li>
            <div
              className="option"
              onClick={() => {
                if (Cookies.get(`id`)) {
                  axios
                    .post(
                      "http://localhost/Ma-rifah/get_main_student_info.php",
                      Cookies.get("id")
                    )
                    .then((response) => {
                      const serverResponse: {
                        status: string;
                        message: {
                          studentName: string;
                          avatar: string;
                        };
                      } = response.data;
                      console.log(serverResponse);
                      setUserName(serverResponse.message.studentName);
                      setProfileUrl(serverResponse.message.avatar);
                    });
                  navigate("/Courses");
                } else {
                  navigate("/login?src=land");
                }
              }}
            >
              Start learning
            </div>
          </li>
          <Menu
            id="sections"
            className="sections"
            component="ul"
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
          >
            <MenuItem onClick={handleClose} component="li">
              <a className="sections-link" href="#About">
                About
              </a>
            </MenuItem>
            <MenuItem onClick={handleClose} component="li">
              <a className="sections-link" href="#Academic-Support">
                Academic Support
              </a>
            </MenuItem>
            <MenuItem onClick={handleClose} component="li">
              <a className="sections-link" href="#Q&A">
                Q & A
              </a>
            </MenuItem>
            <MenuItem onClick={handleClose} component="li">
              <a className="sections-link" href="#Contact-us">
                Contact us
              </a>
            </MenuItem>
          </Menu>
        </ul>
      </div>
    </>
  );
};
