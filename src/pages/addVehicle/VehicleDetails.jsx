// Import necessary modules
import { useRef, useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import NavBar from "../../components/ClientNavBar";
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Text,
  Flex,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const dateOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Kolkata",
  //timeZoneName: 'short',
};

const getDateTimeFormatted = (dateTime) => {
  try {
    const dateObj = new Date(dateTime);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date format");
    }

    const formattedDate = new Intl.DateTimeFormat("en-IN", dateOptions).format(
      dateObj
    );
    return formattedDate;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};

// Define the main Details component
const Details = () => {
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: "",
    vehicleType: "",
    vehiclePrice: "",
    vehicleTiming: "",
  });

  const toast = useToast();

  const { id } = useParams();
  console.log("url params id : ", id);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3100/api/vehicle/${id}`,
          config
        );
        console.log("vehicle res = ", res);
        const { vehicleNumber, vehicleType, vehicleCharge, dateTime } =
          res.data.vehicleDetails;

        setVehicleDetails({
          vehicleNumber,
          vehicleType,
          vehiclePrice: vehicleCharge,
          vehicleTiming: dateTime,
        });

        console.log("Vehicle details:", vehicleNumber);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const addVehicleHandler = () => {
    navigate("/client");
  };

  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };

  const printHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CLIENT_NODE_URL}/api/print/${id}`,
        config
      );
      // navigate("/client")
      console.log("printing res = ", res);
    } catch (error) {
     if (error.response.status === 505) {
       toast({
         title: "Printer not found",
         description: "kindly connect your printer",
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
    }
  };

  let newVehicleType = "";

  if (vehicleDetails.vehicleType === "TWO") {
    newVehicleType = "2-WHEELER";
  } else if (vehicleDetails.vehicleType === "THREE") {
    newVehicleType = "3-WHEELER";
  } else if (vehicleDetails.vehicleType === "FOUR") {
    newVehicleType = "4-WHEELER";
  } else if (vehicleDetails.vehicleType === "BUS") {
    newVehicleType = "BUS";
  }

  return (
    <>
      <NavBar />
      <Center as="section" h="65vh">
        <Box
          ref={componentRef}
          id="printMe"
          maxW="420px"
          bg="white"
          p="6"
          boxShadow="lg"
          borderRadius={6}
        >
          <Flex align="center">
            <Box mr={4}>
              <Image src="/logo.png" width={100} />
            </Box>

            <Box>
              {vehicleDetails.vehicleType === "TWO" ? (
                <Image ml={10} src="/twoWheeler.png" width={100} />
              ) : vehicleDetails.vehicleType === "THREE" ? (
                <Image ml={10} src="/threeWheeler.png" width={100} />
              ) : vehicleDetails.vehicleType === "FOUR" ? (
                <Image ml={10} src="/fourWheeler.png" width={100} />
              ) : (
                <Image ml={10} src="/bus.png" width={100} />
              )}
            </Box>
          </Flex>

          <Heading textAlign={"center"} my="4" size="lg">
            Water Ville
          </Heading>
          <Text>
            <b>Vehicle Number : </b> {vehicleDetails.vehicleNumber}
            <br />
            <b>Vehicle Type : </b> {newVehicleType}
            <br />
            <b>Price : </b>
            {vehicleDetails.vehiclePrice}
            <br />
            <b>Timing : </b>
            {getDateTimeFormatted(vehicleDetails.vehicleTiming)}
            <br />
          </Text>
        </Box>
      </Center>
      <Center>
        {/* Centered buttons */}
        <Button onClick={addVehicleHandler} mr={4} colorScheme="teal">
          Add new vehicle
        </Button>
        {/* ReactToPrint component for handling printing */}

        <Button onClick={printHandler} colorScheme="green">
          Print Ticket
        </Button>
      </Center>
    </>
  );
};

export default Details;
