"use client";

import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  useColorModeValue,
  CircularProgress,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const formBackground = useColorModeValue("gray.170", "gray.700");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });

  const toast = useToast();
  /*const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulating login validation
    // Replace with your actual login logic
    if (email === "admin@gmail.com" && password === "admin1234") {
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      // Redirect to /admin after successful login
      router.push("/admin");
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please login with true credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    setIsLoading(false);
  };*/

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log("before post user=", user);
    try {
      const response = await axios.post("http://localhost:3100/api/login", {
        username: user.username,
        password: user.password,
      });
      console.log(response);
      if (response.status === 200) {
         localStorage.setItem("token", JSON.stringify(response.data.token));
        navigate("/client");

        toast({
          title: "Login Successfull",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.log("error", error);

      toast({
        title: "Invalid credentials",
        description: "Please login with correct credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Image mr="100px" width={"600px"} src="/logo.png" />
        <Flex
          flexDirection="column"
          bg={formBackground}
          p={12}
          borderRadius={8}
          boxShadow="lg"
        >
          <Heading mb={6} textAlign="center">
            Log In
          </Heading>
          <Input
            placeholder="client1"
            type="username"
            variant="filled"
            mb={3}
            isRequired
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <InputGroup mb={6}>
            <Input
              placeholder="**********"
              type={showPassword ? "text" : "password"}
              variant="filled"
              pr="4.5rem"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <InputRightElement width="4.5rem">
              <IconButton
                h="1.75rem"
                size="sm"
                onClick={handleTogglePassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                icon={showPassword ? <HiEyeOff /> : <HiEye />}
              />
            </InputRightElement>
          </InputGroup>
          <Button type="submit" colorScheme="teal" mb={8} disabled={isLoading}>
            {isLoading ? (
              <CircularProgress isIndeterminate size="24px" color="teal" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default Login;
