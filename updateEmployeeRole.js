import mongoose from "mongoose";
import Employee from "./api/models/employee.model.js";

const MONGO_URI = "your_mongodb_connection_string_here";

async function updateEmployeeRoles() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update all employees with role not "Manager" to role "Manager"
    const result = await Employee.updateMany(
      { role: { $ne: "Manager" } },
      { $set: { role: "Manager" } }
    );

    console.log(`Updated ${result.modifiedCount} employee(s) to role "Manager".`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating employee roles:", error);
  }
}

updateEmployeeRoles();
