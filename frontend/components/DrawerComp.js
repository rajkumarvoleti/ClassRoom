import {
  Drawer,
  List,
  ListItem,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useQuery } from "@apollo/client";

import {
  GET_STUDENT_CLASSNAMES,
  GET_TEACHER_CLASSNAMES,
} from "../graphql/ClassQueries";

const ListItemComp = ({ _class }) => {
  return (
    <ListItem>
      <ListItemButton component="a" href={`/class/${_class.id}`}>
        <ListItemText primary={_class.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default function DrawerComp({
  anchorElNav,
  handleCloseNavMenu,
  userId,
}) {
  const {
    data: studentData,
    loading: studentLoading,
    error: studentError,
  } = useQuery(GET_STUDENT_CLASSNAMES, {
    variables: { id: userId },
  });

  const {
    data: teacherData,
    loading: teacherLoading,
    error: teacherError,
  } = useQuery(GET_TEACHER_CLASSNAMES, {
    variables: { id: userId },
  });

  if (studentLoading || teacherLoading) return <p>loading</p>;
  if (studentError || teacherError) {
    console.log({ studentError, teacherError });
    return <p>Something went wrong</p>;
  }

  console.log({ studentData, teacherData });

  return (
    <Drawer
      id="menu-appbar"
      anchorEl={anchorElNav}
      key="left"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
      sx={{
        display: "flex",
      }}
    >
      <Box sx={{ width: "300px", bgcolor: "background.paper" }}>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem>
              <ListItemButton component="a" href="/dashboard">
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Divider />

        <nav aria-label="secondary mailbox folders">
          <List>
            <ListSubheader>Teaching</ListSubheader>
            {!teacherData.allClasses[0] && <p>No classes to show</p>}
            {teacherData.allClasses.map((_class) => (
              <ListItemComp key={_class.id} _class={_class} />
            ))}
          </List>
        </nav>
        <Divider />

        <nav aria-label="secondary mailbox folders">
          <List>
            <ListSubheader>Enrolled</ListSubheader>
            {!studentData.allClasses[0] && <p>No classes to show</p>}
            {studentData.allClasses.map((_class) => (
              <ListItemComp key={_class.id} _class={_class} />
            ))}
          </List>
        </nav>
        <Divider />
      </Box>
    </Drawer>
  );
}
