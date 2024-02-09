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

  const { id } = useParams();
  console.log("url params id : ", id);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3100/api/vehicle/${id}`);
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

  const printHandler = async() => {
    const res = await axios.get("http://localhost:3100/api/print");
    console.log("printing res = " , res);
  };

  return (
    <>
      <NavBar />
      <Center as="section" h="70vh">
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
            <b>Number : </b> {vehicleDetails.vehicleNumber}
            <br />
            <b>Type : </b> {vehicleDetails.vehicleType}
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
        <Button onClick={addVehicleHandler} mr={4} mb={10} colorScheme="teal">
          Add new vehicle
        </Button>
        {/* ReactToPrint component for handling printing */}

        <Button onClick={printHandler} mb={10} colorScheme="green">
          Print Ticket
        </Button>
      </Center>
    </>
  );
};

export default Details;
