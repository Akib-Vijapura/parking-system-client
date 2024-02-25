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
    console.log("dateTime=", dateTime)
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
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const toast = useToast();

  //const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Retrieve the object from storage
        var retrievedObject = localStorage.getItem('ticket');

        console.log('retrievedObject: ', JSON.parse(retrievedObject));
        retrievedObject = JSON.parse(retrievedObject)

        if(retrievedObject === undefined || retrievedObject === null) {
          toast({
            title: "Failed to get details",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }

        setVehicleDetails({
          vehicleNumber: retrievedObject.number,
          vehicleType: retrievedObject.type,
          vehiclePrice: retrievedObject.charge,
          vehicleTiming: retrievedObject.dateTime,
        });

      } catch (error) {
        console.log("Error getting details from storage:", error);
        toast({
          title: "Failed to get details",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }

      setLoading(false);
    };

    fetchData();

  }, [isDisabled]);

  const disableButton = () => {
    setIsDisabled(true);
    //"Wait for 5 seconds..."
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };

  const addVehiclePrintAndSaveToDB = async () => {
    disableButton();
    try {
      if (vehicleDetails.vehicleNumber && vehicleDetails.vehicleType && vehicleDetails.vehiclePrice) {
        const response = await axios.post(
          `${import.meta.env.VITE_CLIENT_NODE_URL}/api/addandprint`,
          {
            vehicleNumber: vehicleDetails.vehicleNumber,
            vehicleType: vehicleDetails.vehicleType,
            vehicleCharge: vehicleDetails.vehiclePrice,
            dateTime: vehicleDetails.vehicleTiming
          },
          config
        );

        if(response.status === 200) {
          //const data = response.data
          //console.log("data=",data)
          toast({
            title: "Saved and printed",
            description: "",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });

          navigate("/client");
        }
      }
    }catch(err) {
      console.error("API Error:", err);
     
      if(err.response.status === 505) {
        toast({
          title: "Printer not connected",
          description: "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else if(err.response.status === 502) {
        toast({
          title: "Printing failed",
          description: "Check printer status and try again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else if (err.response.status === 402) {
        toast({
          title: "Vehicle charge is updated",
          description: "Please add the entry again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
      else {
        toast({
          title: "Something went wrong",
          description: "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
  }

  const addVehicleHandler = () => {
    navigate("/client");
  };

  const printHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CLIENT_NODE_URL}/api/print/${id}`,
        config
      );
      // navigate("/client")
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
      {loading ? ("loading") : (
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
      )}
      <Center>
        {/* Centered buttons */}
        <Button onClick={addVehicleHandler} mr={4} colorScheme="teal">
          Add new vehicle
        </Button>
        {/* ReactToPrint component for handling printing */}

        <Button onClick={addVehiclePrintAndSaveToDB} colorScheme="green" isDisabled={isDisabled}>
          Print Ticket
        </Button>

        {/* <Box as='button' onClick={disableButton} disabled={isDisabled}>
            Shaim
        </Box> */}
      </Center>
    </>
  );
};

export default Details;
