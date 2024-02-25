function shortenToken(token) {
    // Truncate the token to 8 characters
    const truncatedToken = token.slice(0, 8);
  
    // Convert the truncated token to a numeric value
    const numericValue = parseInt(truncatedToken, 36);
  
    // Use modulo to bring it down to 6 digits
    const shortenedNumericValue = numericValue % 1000000;
  
    // Convert back to a string and pad with zeros if needed
    const shortenedToken = shortenedNumericValue.toString().padStart(6, "0");
  
    return shortenedToken;
  }
  
  function obfuscateVehicleNumber(vehicleNumber) {
    // Simple obfuscation logic: take only the first 3 characters and add some random characters
    const obfuscatedVehicleNumber =
      vehicleNumber.slice(0, 3) + Math.random().toString(36).substring(2, 6);
  
    return obfuscatedVehicleNumber;
  }
  
  export function generateUniqueToken(vehicleNumber) {
    // Obfuscate the vehicle number
    const obfuscatedVehicleNumber = obfuscateVehicleNumber(vehicleNumber);
  
    // Get the current timestamp
    const timestamp = Date.now();
  
    // Format the current time as a string (e.g., 'YYYYMMDDHHmmss')
    const formattedTime = new Date(timestamp)
      .toISOString()
      .replace(/[-:T.]/g, "");
  
    // Combine the obfuscated vehicle number and formatted time to create the unique token
    const uniqueToken = shortenToken(
      `${obfuscatedVehicleNumber}${formattedTime}`
    );
  
    return uniqueToken;
  }
