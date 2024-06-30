import {
  Flex,
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import CountUp from "react-countup";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const WindowWiseData = () => {

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const windowNo = decodedToken.user.windowNo;

  const [data, setData] = useState([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [counts, setCounts] = useState({
    TWO: 0,
    THREE: 0,
    FOUR: 0,
    BUS: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

        const response = await axios.get(`${import.meta.env.VITE_CLIENT_NODE_URL}/api/windows/today` , config);
        const windowData = response.data.groupedEntries.find(entry => entry.windowNo === windowNo.toString());

        if (windowData) {
          setData(windowData.entries);
          const vehicleCounts = { TWO: 0, THREE: 0, FOUR: 0, BUS: 0 };
          let vehicles = 0;
          let cash = 0;

          windowData.entries.forEach(entry => {
            vehicleCounts[entry.vehicleType] += 1;
            vehicles += 1;
            cash += entry.vehicleCharge;
          });

          setCounts(vehicleCounts);
          setTotalVehicles(vehicles);
          setTotalCash(cash);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [windowNo]);

  return (
    <Box
      p={6}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      width="300px"
      height="200px"
      _hover={{ boxShadow: "lg" }}
      mb={4}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontSize="xl" fontWeight="bold" color="teal.500">
          Today's Window counter
        </Text>
      </Flex>
      <Flex direction="row" justifyContent="space-around">
        {[
          { src: "/twoWheeler.png", type: "TWO" },
          { src: "/threeWheeler.png", type: "THREE" },
          { src: "/fourWheeler.png", type: "FOUR" },
          { src: "/bus.png", type: "BUS" },
        ].map((item, index) => (
          <Flex key={index} direction="column" alignItems="center">
            <Image src={item.src} width={10} />
            <CountUp end={counts[item.type]} duration={5} />
          </Flex>
        ))}
      </Flex>
      <Text mt={4}>
        <Text as="span" fontWeight="bold">
          Total Vehicles:{" "}
        </Text>
        <CountUp end={totalVehicles} duration={5} />
      </Text>
      <Text>
        <Text as="span" fontWeight="bold">
          Total Cash:{" "}
        </Text>
        <CountUp end={totalCash} duration={5} />
      </Text>
    </Box>
  );
};

export default WindowWiseData;
