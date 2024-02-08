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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const navigate = useNavigate();
  const formBackground = useColorModeValue("gray.170", "gray.700");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulating login validation
    // Replace with your actual login logic
    if (email === "demouser@gmail.com" && password === "demo1234") {
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      // Redirect to /home after successful login
      navigate("/home");
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
  };

   const handleTogglePassword = () => {
     setShowPassword(!showPassword);
   };

  return (
    <form onSubmit={handleSubmit}>
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Flex
          flexDirection="column"
          bg={formBackground}
          p={12}
          borderRadius={8}
          boxShadow="lg"
        >
          <Heading mb={6} textAlign="center">
            LogIn
          </Heading>
          <Input
            placeholder="johndoe@email.com"
            type="email"
            variant="filled"
            mb={3}
            isRequired
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <InputGroup mb={6}>
            <Input
              placeholder="**********"
              type={showPassword ? "text" : "password"}
              variant="filled"
              pr="4.5rem"
              onChange={(event) => setPassword(event.currentTarget.value)}
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
