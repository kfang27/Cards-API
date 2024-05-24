import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/shuffle');
});

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

app.get('/draw_display/:deck_id', async (req, res) => {
  const { deck_id } = req.params;
  const count = 5;
  try {
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`);
    res.render('index', { cards: response.data.cards });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
