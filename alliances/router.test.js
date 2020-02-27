const request = require("supertest");
const server = require("../api/server.js");

describe("alliances router", function() {
  it("should run the tests", function() {
    expect(true).toBe(true); // this line is called an assertion
    // .toBe() is called a matcher
  });

  describe("GET /", function() {
    it("should return 200 ok", function() {
      // we import supertest to use the request functionality
      return request(server)
        .get("/api/alliances")
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it("should return alliances as the router value", function() {
      return request(server)
        .get("/api/alliances")
        .then(res => {
          expect(res.body.router).toBe("alliances");
        });
    });

    it("should return alliances as the router value (async version)", async function() {
      const res = await request(server).get("/api/alliances");

      expect(res.body.router).toBe("alliances");
    });

    it("should return JSON formatted body", function() {
      return request(server)
        .get("/api/alliances")
        .then(res => {
          expect(res.type).toMatch(/json/);
        });
    });
  });
});
