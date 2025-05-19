import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet } from "react-router-dom";

 const DrawerNavDoctor = () => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState({
    DoctorProgram: false,
    CalenderPage: false,
  });

  const handleMouseEnter = (page) => {
    setHovered((prev) => ({ ...prev, [page]: true }));
  };

  const handleMouseLeave = (page) => {
    setHovered((prev) => ({ ...prev, [page]: false }));
  };

  return (
    <>
      <IconButton 
        onClick={() => setOpen(true)} 
        sx={{ 
          color: "#0fa4af",
          position: "fixed",  
          top: 20,              
          left: 20,             
          zIndex: 1300,          
          display: open ? "none" : "block"  
        }}
      >
        <FontAwesomeIcon icon={faBars} />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
        <List sx={{ width: "250px", padding: "10px" }}>
          <ListItem
            role="button"
            component={Link}
            to="/doctor/CalenderPage"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("CalenderPage")}
            onMouseLeave={() => handleMouseLeave("CalenderPage")}
            style={hovered.CalenderPage ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
            <ListItemText 
              primary="CalenderPage" 
              style={styles.listItemText} 
            />
          </ListItem>

          <ListItem
            role="button"
            component={Link}
            to="/doctor/DoctorProgram"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("DoctorProgram")}
            onMouseLeave={() => handleMouseLeave("DoctorProgram")}
            style={hovered.DoctorProgram ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
            <ListItemText 
              primary="DoctorProgram" 
              style={styles.listItemText} 
            />
          </ListItem>

        </List>
      </Drawer>
      <Outlet />
    </>
  );
};

const styles = {
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease, transform 0.3s ease", 
  },
  hoveredItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "4px",
    backgroundColor: "#0fa4af",  
    transform: "scale(1.05)",  
    transition: "background-color 0.3s ease, transform 0.3s ease", 
  },
  listItemText: {
    marginLeft: "20px",  
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  icon: {
    fontSize: "20px",
    color: "#333",
  },
};


export default DrawerNavDoctor