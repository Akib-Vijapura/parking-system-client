"use client";
import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Image,
  useToast,
} from "@chakra-ui/react";
// import { deleteCookie } from "cookies-next";
import { Link, useNavigate } from "react-router-dom";
const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <Image
        //borderRadius='full'
        boxSize="100px"
        src="/logo.png"
        alt="Water Ville"
        cursor={"pointer"}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="black"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="black"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem = ({ children, isLast, ...rest }) => {
  return (
    <Text display="block" {...rest}>
      {children}
    </Text>
  );
};

const MenuLinks = ({ isOpen }) => {
  const navigate = useNavigate();
  const toast = useToast();
  // This will remove cookie and redirect to login page
  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast({
      title: "Logout Successfull",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <Link to="/client">
          <MenuItem>Home</MenuItem>
        </Link>

        <Link to="/client">
          <MenuItem to="/client">Add Vehicles </MenuItem>
        </Link>

        <Link to="/admin">
          <MenuItem to="/admin">Admin</MenuItem>
        </Link>
        <MenuItem isLast>
          <Button onClick={logoutHandler} colorScheme="teal">
            Logout
          </Button>
        </MenuItem>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex align="center" justify="center">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="95%"
        p={5}
        m={5} // Adjust margin for spacing around the Navbar
        bg={["primary.500", "primary.500", "transparent", "transparent"]}
        color={["black", "black", "primary.700", "primary.700"]}
        position="relative"
        style={{
          borderRadius: "15px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
        }}
        {...props}
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default NavBar;
