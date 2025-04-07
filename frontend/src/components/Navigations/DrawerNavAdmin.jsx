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
  faUserEdit,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const DrawerNavAdmin = () => {
  const [open, setOpen] = useState(false);

  const [hovered, setHovered] = useState({
    EditUsers: false,
    AddDoctors: false,
    Doctors: false,
  });

  // Handle mouse enter and leave for hover effect
  const handleMouseEnter = (page) => {
    setHovered((prev) => ({ ...prev, [page]: true }));
  };

  const handleMouseLeave = (page) => {
    setHovered((prev) => ({ ...prev, [page]: false }));
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ color: "#0fa4af" }}>
        <FontAwesomeIcon icon={faBars} />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
        <List sx={{ width: "250px", padding: "10px" }}>
        <ListItem
            role="button"
            component={Link}
            to="/doctors"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("Doctors")}
            onMouseLeave={() => handleMouseLeave("Doctors")}
            style={hovered.Doctors ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
            <ListItemText primary="Doctors" style={styles.listItemText} />
          </ListItem>

          <ListItem
            role="button"
            component={Link}
            to="/"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("EditUsers")}
            onMouseLeave={() => handleMouseLeave("EditUsers")}
            style={hovered.EditUsers ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserEdit} style={styles.icon} />
            <ListItemText primary="Edit Users" style={styles.listItemText} />
          </ListItem>

          <ListItem
            role="button"
            component={Link}
            to="/adddoctors"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("AddDoctors")}
            onMouseLeave={() => handleMouseLeave("AddDoctors")}
            style={hovered.AddDoctors ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
            <ListItemText primary="Add Doctors" style={styles.listItemText} />
          </ListItem>
          
          
        </List>
      </Drawer>
    </>
  );
};

const styles = {
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease, transform 0.3s ease", // Animation on hover
  },
  hoveredItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "4px",
    backgroundColor: "#0fa4af",  // Change background color on hover
    transform: "scale(1.05)",  // Slightly enlarge the item on hover
    transition: "background-color 0.3s ease, transform 0.3s ease", // Smooth animation
  },
  listItemText: {
    marginLeft: "10px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  icon: {
    fontSize: "20px",
    color: "#333",
  },
};

export default DrawerNavAdmin;