import { useState, useEffect } from "react";
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
import WindowWiseData from "../../components/WindowWiseData";

const AddVehicle = () => {
  const navigate = useNavigate();
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

      if (vehicle.vehicleNumber && vehicle.vehicleType) {
        const response = await axios.get(
          `${import.meta.env.VITE_CLIENT_NODE_URL}/api/vehicle/charge/${vehicle.vehicleType}`,
          config
        );

        if (response.status === 200) {
          const charge = response.data.vehicleCharge;
          const number = vehicle.vehicleNumber.toUpperCase();
          const dateTime = Date.now();
          var testObject = {
            type: vehicle.vehicleType,
            number: number,
            charge: charge,
            dateTime: dateTime,
          };

          localStorage.setItem("ticket", JSON.stringify(testObject));
          navigate(`/client/details/${vehicle.vehicleNumber}`);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response && error.response.status === 505) {
        toast({
          title: "Printer not found",
          description: "Kindly connect your printer",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
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

  useEffect(() => {
    localStorage.removeItem("ticket");
  }, []);

  return (
    <>
      <NavBar />
      <Flex
        justify="space-between"
        align="flex-start"
        flexDirection={{ base: "column", md: "row" }}
        p={10}
      >
        <Flex
          flexDirection="column"
          align="flex-end"
          mb={{ base: 8, md: 0 }}
          order={{ base: 2, md: 1 }}
        >
          <WindowWiseData />
        </Flex>
        <Flex
          justify="center"
          align="center"
          flexDirection="column"
          maxWidth="400px"
          width="100%"
          marginRight={450}
          marginTop={150}
          order={{ base: 1, md: 2 }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex
              bg="white"
              p={6}
              borderRadius={8}
              boxShadow="lg"
              flexDirection="column"
            >
              <Heading mb={6} textAlign="center">
                Parking Entry
              </Heading>
              <Input
                placeholder="Enter Vehicle Number"
                type="string"
                variant="filled"
                mb={6}
                style={{ textTransform: "uppercase" }}
                maxLength="10"
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
                  <Stack direction="row" spacing={4} justify="center">
                    <Radio value="TWO">
                      <Image src="/twoWheeler.png" width="50px" />
                    </Radio>
                    <Radio value="THREE">
                      <Image src="/threeWheeler.png" width="40px" />
                    </Radio>
                    <Radio value="FOUR">
                      <Image src="/fourWheeler.png" width="50px" />
                    </Radio>
                    <Radio value="BUS">
                      <Image src="/bus.png" width="50px" />
                    </Radio>
                  </Stack>
                </RadioGroup>
              </InputGroup>
              <Button
                type="submit"
                colorScheme="teal"
                mb={6}
                isFullWidth={true}
                isLoading={isLoading}
                loadingText="Adding Vehicle"
              >
                {isLoading ? (
                  <CircularProgress
                    isIndeterminate
                    size="24px"
                    color="teal"
                  />
                ) : (
                  "Add Vehicle"
                )}
              </Button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    </>
  );
};

export default AddVehicle;