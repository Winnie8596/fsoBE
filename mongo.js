const mongoose = require("mongoose");
require("dotenv").config();

if (process.argv.length < 3) {
  console.log("Usage: node script.js <password> [<name> <number>]");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  // Add a new person
  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((result) => {
      console.log(`Added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error saving the person:", err.message);
      mongoose.connection.close();
    });
} else {
  // List all persons
  Person.find({})
    .then((persons) => {
      console.log("Phonebook:");
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error fetching persons:", err.message);
      mongoose.connection.close();
    });
}
