import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  CircularProgress,
  useToast,
  InputGroup,
} from "@chakra-ui/react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import axios from "axios";
import NavBar from "../../components/ClientNavBar";
import { useNavigate } from "react-router-dom";

const AddVehicle = () => {
  const navigate = useNavigate();
  // const formBackground = useColorModeValue("gray.170", "gray.700");
  const [isLoading, setIsLoading] = useState(false);

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
  });

  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      // Check if vehicleNumber and vehicleType are present
      if (vehicle.vehicleNumber && vehicle.vehicleType) {
        const response = await axios.post(
          `${import.meta.env.VITE_CLIENT_NODE_URL}/api/vehicle`,
          {
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.vehicleType,
          },
          config
        );

        if (response.status === 200) {
          navigate(`/client/details/${response.data.vehicle._id}`);
          toast({
            title: "Vehicle Added Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }

      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response.status === 505) {
        toast({
          title: "Printer not found",
          description: "kindly connect your printer",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }else {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit}>
        <Flex
          h="80vh"
          alignItems="center"
          justifyContent="center"
          bg={"whit"}
          flexDirection="column"
        >
          <Flex
            flexDirection="column"
            bg={"white"}
            p={12}
            borderRadius={8}
            boxShadow="lg"
          >
            <Heading mb={10} textAlign="center">
              Parking Entry
            </Heading>
            <Input
              placeholder="GJ01BT9999"
              type="string"
              variant="filled"
              mb={12}
              // isRequired
              style={{ textTransform: "uppercase" }}
              value={vehicle.vehicleNumber}
              onChange={(event) =>
                setVehicle({
                  ...vehicle,
                  vehicleNumber: event.currentTarget.value,
                })
              }
            />
            <InputGroup mb={6}>
              <RadioGroup
                onChange={(value) =>
                  setVehicle({ ...vehicle, vehicleType: value })
                }
                value={vehicle.vehicleType}
              >
                <Stack direction="row">
                  <Radio value="TWO">
                    {/* <RiMotorbikeFill style={{ fontSize: "30px" }} /> */}
                    <Image width="50px" src="/twoWheeler.png" />
                  </Radio>
                  <Radio value="THREE">
                    <Image width="40px" src="/threeWheeler.png" />
                  </Radio>
                  <Radio value="FOUR">
                    <Image width="50px" src="/fourWheeler.png" />
                  </Radio>
                  <Radio value="BUS">
                    <Image width="50px" src="/bus.png" />
                  </Radio>
                </Stack>
              </RadioGroup>
            </InputGroup>
            <Button
              type="submit"
              colorScheme="teal"
              mb={8}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                "Add Vehicle"
              )}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
};

export default AddVehicle;
