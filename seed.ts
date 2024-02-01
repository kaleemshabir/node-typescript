const mongoose = require("mongoose");
const { Task } = require("./src/models/task.model");
const { User } = require("./src/models/user.model");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const tasks = [
  {
    title: "Task 1",
    status: "completed",
  },
  {
    title: "Task 2",
  },
  {
    title: "Task 3",
  },
  {
    title: "Task 4",
    status: "completed",
  },
];

// Function to store tasks in db
const storeTasks = async () => {
  console.log("*******");
  await User.deleteMany();
  await Task.deleteMany();
  
  const user = await User.create({
    email: "admin@gmail.com",
    password: "admin123",
    isAdmin: true,
  });
  console.log(user);
  const list = tasks.map((t) => ({ ...t, createdBy: user._id }));
  // console.log(list);
  await Task.insertMany(list);

  // Log the results
  // console.log("rsult:", result);
};

storeTasks();
