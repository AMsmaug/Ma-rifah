import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { List, ListItem, ListItemButton } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect } from "react";
import "./sidebar.css";
import Skeleton from "@mui/material/Skeleton";

const drawerWidthSmall = 250;

const drawerWidthMedium = 250;

const drawerWidthLarge = 320;

type Props = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

const SideBar = ({ mobileOpen, handleDrawerToggle }: Props) => {
  const [expandedAccordion, setexpandedAccordion] = useState<number | null>(
    null
  );

  const [isLoading, setisLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setisLoading(false);
    }, 1500);
  }, []);

  const courses = [
    "Math",
    "Physics",
    "English",
    "Chemistery",
    "Geography",
    "History",
    "French",
  ];

  const handleChange = (isExpanded: boolean, panel: number) => {
    setexpandedAccordion(isExpanded ? panel : null);
  };

  const drawer = (
    <div className="side-bar">
      <Toolbar />
      <Divider />
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Box className="courses-list" mt={3}>
          {courses.map((c, i) => (
            <CoursesListItem
              key={i}
              courseName={c}
              courseNumber={i}
              expanded={expandedAccordion === i}
              handleChange={handleChange}
            />
          ))}
        </Box>
      )}
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: {
          sm: drawerWidthSmall,
          md: drawerWidthMedium,
          lg: drawerWidthLarge,
        },
        flexShrink: { sm: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: {
              xs: drawerWidthSmall,
              md: drawerWidthMedium,
              lg: drawerWidthLarge,
            },
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: {
              xs: drawerWidthSmall,
              md: drawerWidthMedium,
              lg: drawerWidthLarge,
            },
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideBar;

type courseProps = {
  courseName: string;
  courseNumber: number;
  expanded: boolean;
  handleChange: (isExpanded: boolean, panel: number) => void;
};

const CoursesListItem = ({
  courseName,
  courseNumber,
  expanded,
  handleChange,
}: courseProps) => {
  const accordionSummaryId = `panel${courseNumber}-header`;
  const accordionSummaryAriaControls = `panel${courseNumber}-content`;

  return (
    <Accordion
      sx={{
        boxShadow: "none",
        "& .MuiAccordionSummary-root": {
          flexDirection: "row-reverse",
          gap: "10px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        "&:before": {
          height: "0",
        },
        "& .MuiSvgIcon-root": {
          color: "primary.main",
        },
        "& .MuiAccordionSummary-content": {
          fontWeight: "bold",
          fontSize: "20px",
        },
      }}
      expanded={expanded}
      onChange={(_, isExpanded) => handleChange(isExpanded, courseNumber)}
    >
      <AccordionSummary
        id={accordionSummaryId}
        aria-controls={accordionSummaryAriaControls}
        expandIcon={<ExpandMoreIcon />}
      >
        {courseName}
      </AccordionSummary>
      <AccordionDetails>
        <List sx={{ paddingRight: "0px" }}>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <span className="chapter">Chapter 1: </span> Functions
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <span className="chapter"> Chapter 2: </span> Trigo
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <span className="chapter"> Chapter 3: </span> Trigo
            </ListItemButton>
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

const LoadingComponent = () => {
  return (
    <Stack
      sx={{ opacity: "0.7" }}
      p={1}
      spacing={1}
      divider={<hr style={{ opacity: "0.7" }} />}
    >
      <Skeleton variant="rectangular" height={48} animation="wave" />
      <Skeleton variant="rectangular" height={48} animation="wave" />
      <Skeleton variant="rectangular" height={48} animation="wave" />
    </Stack>
  );
};
