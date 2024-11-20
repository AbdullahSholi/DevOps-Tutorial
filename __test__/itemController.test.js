const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Item = require("../src/models/itemModel");
const itemController = require("../src/controllers/itemController");

describe("Item Controller", () => {
  let mongoServer;

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
  
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Item.deleteMany();
  });

  describe("createItem", () => {
    it("should create a new item", async () => {
      const req = {
        body: { name: "Item1", quantity: 10, price: 100 }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await itemController.createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Item1" }));

      const items = await Item.find();
      expect(items).toHaveLength(1);
    });

    it("should return 400 if validation fails", async () => {
      const req = { body: { name: "", quantity: 10, price: 100 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await itemController.createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });
  });

  describe("getItems", () => {
    it("should return all items", async () => {
      await Item.create([{ name: "Item1", quantity: 5, price: 50 }, { name: "Item2", quantity: 10, price: 100 }]);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await itemController.getItems(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: "Item1" }),
        expect.objectContaining({ name: "Item2" })
      ]));
    });
  });

  describe("getItemById", () => {
    it("should return an item by ID", async () => {
      const item = await Item.create({ name: "Item1", quantity: 10, price: 100 });

      const req = { params: { id: item._id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await itemController.getItemById(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Item1" }));
    });

    it("should return 404 if item not found", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await itemController.getItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // Similar tests for updateItem and deleteItem
});
