const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/shoppingList', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema and Model
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  purchased: Boolean,
});

const Item = mongoose.model('Item', itemSchema);

// Routes
// Get all items
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Add a new item
app.post('/api/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    quantity: req.body.quantity,
    purchased: false, // Default to not purchased
  });
  await newItem.save();
  res.json(newItem);
});

// Edit an item
app.put('/api/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, quantity: req.body.quantity },
    { new: true }
  );
  res.json(updatedItem);
});

// Mark an item as purchased
app.put('/api/items/:id/purchased', async (req, res) => {
  const item = await Item.findById(req.params.id);
  item.purchased = !item.purchased; // Toggle purchased status
  await item.save();
  res.json(item);
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});