import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// Got the message "Error: No default engine was specified and no extension was provided.", so had to include this
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static("public"));

// This is the handler for the root URL, which will just redirect to the shuffle endpoint
app.get('/', (req, res) => {
  res.redirect('/shuffle');
});

// The shuffle endpoint just shuffles a new deck of cards, and then redirects to the draw/display endpoint
app.get("/shuffle", async (req, res) => {
  try {
    const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const deck_id = response.data.deck_id;
    res.redirect(`/draw_display/${deck_id}`);
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index", { error: error.message });
  }
});

// This endpoint draws 5 cards using the deck's specified ID and then render
app.get('/draw_display/:deck_id', async (req, res) => {
  const { deck_id } = req.params;
  const count = 5;
  try {
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`);
    const remaining = response.data.remaining;
    
    // If the remaining amount of cards is less than 5, redirect back to the shuffle endpoint to use a new deck of cards
    if (remaining < 5) {
      res.redirect('/shuffle');
      return;
    }
    res.render('index.ejs', { cards: response.data.cards, remaining });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// This is referenced by the "New Deck" button and will redirect to the shuffle endpoint to get a new deck of cards
app.get('/new_deck', async (req, res) => {
  try {
    // Redirect to shuffle endpoint to get a new deck
    res.redirect('/shuffle');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
