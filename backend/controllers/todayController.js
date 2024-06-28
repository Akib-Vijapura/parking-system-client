import Parking from '../models/Parking.js'// Adjust the path as necessary

// Function to get today's entries from the database
const getEntriesForToday = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const entries = await Parking.find({
            dateTime: { $gte: today },
        });

        return entries;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Function to group entries by window number
const groupEntriesByWindowNo = (entries) => {
    const groupedEntries = [];

    entries.forEach((entry) => {
        const windowNo = entry.windowNo;

        // Check if there's an object with the same windowNo in groupedEntries
        const existingEntry = groupedEntries.find((group) => group.windowNo === windowNo);

        if (!existingEntry) {
            // If not, create a new object and push it to groupedEntries
            groupedEntries.push({ windowNo, entries: [entry] });
        } else {
            // If yes, add the entry to the existing group
            existingEntry.entries.push(entry);
        }
    });

    return groupedEntries;
};

// Controller function to handle GET request
const getEntries = async (req, res) => {
    try {
        // Connect to the database

        // Get today's entries
        const todaysEntries = await getEntriesForToday();

        // Group entries by window number
        const groupedEntries = groupEntriesByWindowNo(todaysEntries);

        // Send response
        res.json({
            todaysEntries,
            groupedEntries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export default getEntries