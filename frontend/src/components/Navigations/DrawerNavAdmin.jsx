import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserPlus, faList } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AddDoctors from "../Doctors/Doctors";
import DropdownsPage from "../Dropdowns/Dropdowns";

const DrawerNavAdmin = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} style={{ color: "#0fa4af" }}>
        <FontAwesomeIcon icon={faBars} />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
        <List>
          <ListItem role="button" component={Link} to="/dashboard/dropdowns" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faList} />
            <ListItemText primary="Dropdowns" />
          </ListItem>

          <ListItem role="button" component={Link} to="/dashboard/adddoctors" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faUserPlus} />
            <ListItemText primary="Add Doctors" />
          </ListItem>
        </List>
      </Drawer>

      <div style={{ marginLeft: open ? 240 : 0, transition: "margin 0.3s" }}>
        <Routes>
          <Route path="/dropdowns" element={<DropdownsPage />} />
          <Route path="/adddoctors" element={<AddDoctors />} />
        </Routes>
      </div>
    </>
  );
};

export default DrawerNavAdmin;
