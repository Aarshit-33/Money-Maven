import bcrypt from "bcryptjs";

const saltRounds = 10;

async function hashAndCompare(password) {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password
    const hash = await bcrypt.hash(password+1, salt);

    console.log("Hash:", hash);
    console.log("Salt:", salt);
    console.log("password:", password);
    
    // Compare the password with the hash
    const result = await bcrypt.compare(password, hash);
    
    // Log the comparison result
    console.log("Comparison result:", result);
    
    return result; // You can return the result to access it outside
  } catch (err) {
    console.error("Error:", err);
    throw err; // Throw error for further handling if needed
  }
}

// Call the async function and handle the result
(async () => {
  try {
    const result = await hashAndCompare("mypassword");
    console.log("Final result:", result); // Access the result here
  } catch (err) {
    console.error("Error in hashing/comparing:", err);
  }
})();
