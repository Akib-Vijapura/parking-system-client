import { Flex, Heading } from "@chakra-ui/react";
import Sidebar from "./sidebar/Sidebar";
const Home = () => {
  return (
    <>
      <Sidebar />
      <Flex w="100%">
        <Flex
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Heading>Deshboard</Heading>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
