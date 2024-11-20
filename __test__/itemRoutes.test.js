const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const express = require("express");
const itemRoutes = require("../src/routes/itemRoutes");
const Item = require("../src/models/itemModel");

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri || 'mongodb://mongo-service:27017/mydatabase')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  app = express();
  app.use(express.json());
  app.use("/api/items", itemRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Item.deleteMany();
});

describe("Item Routes", () => {
  it("POST /api/items should create a new item", async () => {
    const response = await request(app).post("/api/items").send({
      name: "Item1",
      quantity: 10,
      price: 100
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Item1");
  });

  it("GET /api/items should return all items", async () => {
    await Item.create([{ name: "Item1", quantity: 5, price: 50 }, { name: "Item2", quantity: 10, price: 100 }]);

    const response = await request(app).get("/api/items");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("GET /api/items/:id should return an item by ID", async () => {
    const item = await Item.create({ name: "Item1", quantity: 10, price: 100 });

    const response = await request(app).get(`/api/items/${item._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Item1");
  });
});
