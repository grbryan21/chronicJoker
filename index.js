import express from "express";
import bodyParser from "body-parser"
import axios from "axios"


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

//Get joke once category is selected. 
app.post("/get-joke", async (req, res) => {
  const category = req.body.category; // Get the selected category from the form
  const apiUrl = `https://v2.jokeapi.dev/joke/${category}`;

  try {
    const response = await axios.get(apiUrl);
    const jokeData = response.data;

    // Prepare the joke to render
    let joke;
    if (jokeData.type === "single") {
      joke = jokeData.joke;
    } else if (jokeData.type === "twopart") {
      joke = `${jokeData.setup} ... ${jokeData.delivery}`;
    }

    res.render("index", { joke });
  } catch (error) {
    console.error("Error fetching joke:", error.message);
    res.render("index", { joke: "Sorry, something went wrong. Try again!" });
  }
});


// Server Listener
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
