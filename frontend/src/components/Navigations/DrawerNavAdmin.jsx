import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


const DrawerNavAdmin = () => {
  const [open, setOpen] = useState(false);

  const [hovered, setHovered] = useState({
    EditUsers: false,
    AddDoctors: false,
  });

  const handleMouseEnter = (page) => {
    setHovered((prevState) => ({
      ...prevState,
      [page]: true,
    }));
  };

  const handleMouseLeave = (page) => {
    setHovered((prevState) => ({
      ...prevState,
      [page]: false,
    }));
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} style={{ color: "#0fa4af" }}>
        <FontAwesomeIcon icon={faBars} />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
        <List style={{ width: "250px", padding: "10px" }}>

          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("EditUsers")}
            onMouseLeave={() => handleMouseLeave("EditUsers")}
            style={hovered.EditUsers ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserEdit} style={styles.icon} />
            <ListItemText primary="EditUsers" style={styles.listItemText} />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/adddoctors"
            onClick={() => setOpen(false)}
            onMouseEnter={() => handleMouseEnter("AddDoctors")}
            onMouseLeave={() => handleMouseLeave("AddDoctors")}
            style={hovered.AddDoctors ? styles.hoveredItem : styles.listItem}
          >
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
            <ListItemText primary="AddDoctors" style={styles.listItemText} />
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