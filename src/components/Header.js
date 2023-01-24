import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CardHeader ,Avatar, Button, Stack, TextField,InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import Box from "@mui/material/Box";
import React from "react";
import {useNavigate} from "react-router-dom";
import "./Header.css";

const Header = ({debounceSearch,children, hasHiddenAuthButtons}) => {
  const history=useNavigate();
  const logout=()=>{
    localStorage.clear();
    history("/")
    window.location.reload()
  };
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children &&
        <Stack>
        <TextField
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={debounceSearch}
        placeholder="Search for items/categories"
        name="search"
      />
      
      </Stack>
        }
       {hasHiddenAuthButtons ?
       ( <Stack direction="row" spacing={2}>
       <Button
       className="explore-button"
       startIcon={<ArrowBackIcon />}
       variant="text"
       onClick={()=>history("/")}
     >
       Back to explore
     </Button></Stack>)

       : localStorage.getItem("username")===null ?
         <Stack direction="row" spacing={2}>
         <Button
         className="explore-button"
         variant="text"
         onClick={()=>history("/login")}
       >
        LOGIN
       </Button>
       <Button
         className="register-button"
         variant="contained"
         onClick={()=>history("/register")}
       >
        REGISTER
       </Button>
       </Stack>
       :
        <Stack direction="row" spacing={2}>
           <CardHeader
  avatar={
         <Avatar alt={localStorage.getItem("username")} src="../../public/avatar.png"/>
         
  }
  title={localStorage.getItem("username")}
/>
          <Button
          className="explore-button"
          variant="text"
          onClick={logout}
        >
         LOGOUT
        </Button>
          </Stack>
       }
         
           </Box>
    );
};

export default Header;
