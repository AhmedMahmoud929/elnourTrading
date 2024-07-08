const mongoose = require("mongoose");
const Admin = require("./models/admin.model");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const DB_URL = "mongodb://127.0.0.1:27017/elnourTrading";
let connected = false;

// Connect to MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => (connected = true))
  .catch((error) =>
    console.error(colorize("Error connecting to MongoDB:", "red"), error)
  );

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to colorize text
function colorize(text, color) {
  const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
  };

  const colorizedText = colors[color]
    ? colors[color] + text + colors.reset
    : text;
  return colorizedText;
}

// Function to display super admins
async function DISPLAY_SUPER_ADMINS() {
  try {
    const admins = await Admin.find({ isSuper: true });
    if (admins.length === 0) {
      console.log(colorize("No super admins found.", "yellow"));
    } else {
      console.log(colorize("Super Admins:", "blue"));
      const adminData = admins.map((admin) => ({
        "Full Name": admin.fullName,
        "Username ID": admin.username,
        "Created At": new Date(admin.createdAt).toLocaleDateString(),
      }));
      console.table(adminData);
    }
  } catch (err) {
    console.error(colorize("-> Failed to fetch super admins:", "red"), err);
  }
}

// Function to delete a super admin
async function DELETE_SUPER_ADMIN(username) {
  try {
    const result = await Admin.deleteOne({ username });
    if (result.deletedCount > 0) {
      console.log(colorize("-> Super admin deleted successfully", "green"));
    } else {
      console.log(colorize("-> Super admin not found", "yellow"));
    }
  } catch (err) {
    console.error(colorize("-> Deletion failed:", "red"), err);
  }
}

// Function to create a new super admin
async function CREATE_ADMIN(fullName, username, password) {
  try {
    const usernameExist = await Admin.findOne({ username });
    if (!usernameExist) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new user with hashed password
      const newAdmin = new Admin({
        fullName,
        username,
        password: hashedPassword,
        isSuper: true,
      });

      // Save the new user
      await newAdmin.save();
      console.log(colorize("-> New admin has been created", "green"));
    } else {
      console.log(colorize("-> Username is already exist", "red"));
    }
  } catch (err) {
    console.error(colorize("-> Creation failed:", "red"), err);
  }
}

// Function to change the password of a super admin
async function CHANGE_PASSWORD(username, newPassword) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password
    const result = await Admin.updateOne(
      { username },
      { password: hashedPassword }
    );
    if (result.nModified > 0) {
      console.log(colorize("-> Password updated successfully", "green"));
    } else {
      console.log(colorize("-> Super admin not found", "yellow"));
    }
  } catch (err) {
    console.error(colorize("-> Failed to update password:", "red"), err);
  }
}

// Function to show the menu and ask for the operation
function showMenu() {
  const menuColor = "cyan";
  const menuOptions = [
    "1- Display super admins",
    "2- Delete a super admin",
    "3- Add super admin",
    "4- Change super admin password",
    "5- Exit",
  ];
  console.log("\n+" + "-".repeat(35) + "+");
  console.log("|" + " ".repeat(13) + "[ MENU ] " + " ".repeat(13) + "|");
  console.log("+" + "-".repeat(35) + "+");

  menuOptions.map((opt) =>
    console.log(
      "| " +
        colorize(opt, menuColor) +
        " ".repeat(43 - colorize(opt, menuColor).length) +
        "|"
    )
  );

  console.log("+" + "-".repeat(35) + "+");

  rl.question("\nWhat do you want to do? (1-5): ", (choice) => {
    if (choice === "1") {
      DISPLAY_SUPER_ADMINS().finally(() => showMenu());
    } else if (choice === "2") {
      rl.question(
        "<- Enter the username of the super admin to delete: ",
        (username) => {
          DELETE_SUPER_ADMIN(username).finally(() => showMenu());
        }
      );
    } else if (choice === "3") {
      rl.question("<- Enter full name: ", (fullName) => {
        rl.question("<- Enter username: ", (username) => {
          rl.question("<- Enter password: ", (password) => {
            CREATE_ADMIN(fullName, username, password).finally(() =>
              showMenu()
            );
          });
        });
      });
    } else if (choice === "4") {
      rl.question("<- Enter username: ", (username) => {
        rl.question("<- Enter new password: ", (newPassword) => {
          CHANGE_PASSWORD(username, newPassword).finally(() => showMenu());
        });
      });
    } else if (choice === "5") {
      console.log(colorize("-> Goodbye!", "blue"));
      rl.close();
    } else {
      console.log(colorize("-> Invalid choice, please try again.", "red"));
      showMenu();
    }
  });
}

// Start the script
showMenu();
