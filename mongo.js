const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Usage: node script.js <password> [<name> <number>]");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://w4winnie97:${password}@cluster0.voebmho.mongodb.net/personApp`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
      console.error("Error saving the person", err);
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
      console.error("Error fetching persons", err);
      mongoose.connection.close();
    });
}
