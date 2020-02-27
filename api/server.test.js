require("dotenv").config();

describe("server", function() {
  describe("server", function() {
    it("should use the testing environment", function() {
      expect(process.env.DB_ENV).toBe("test");
    });
  });
});
