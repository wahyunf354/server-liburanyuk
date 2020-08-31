const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");
const expect = chai.expect;
const fs = require("fs");

chai.use(chaiHttp);

describe("API ENDPOINT TEST", () => {
  it("GET Landing Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/member/landing-page")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("hero");
        expect(res.body.hero).to.have.all.keys(
          "travelers",
          "cities",
          "treasures"
        );
        expect(res.body).to.have.property("mostPicked");
        expect(res.body.mostPicked).to.be.a("array");
        expect(res.body).to.have.property("categories").with.lengthOf(3);
        expect(res.body.categories).to.be.a("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.all.keys(
          "_id",
          "imageUrl",
          "name",
          "rate",
          "content",
          "familyName",
          "familyOccupation"
        );
      });
    done();
  });

  it("GET Detail Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/member/detail-page/5e96cbe292b97300fc902222")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("sumBooking");
        expect(res.body).to.have.property("country");
        expect(res.body).to.have.property("imageId");
        expect(res.body.imageId).to.be.an("array");
        expect(res.body).to.have.property("featureId");
        expect(res.body.featureId).to.be.an("array");
        expect(res.body).to.have.property("activityId");
        expect(res.body.activityId).to.be.an("array");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("city");
        expect(res.body).to.have.property("isPopular");
        expect(res.body).to.have.property("description");
        expect(res.body.description).to.be.an("string");
        expect(res.body).to.have.property("unit");
        expect(res.body).to.have.property("__v");
        expect(res.body).to.have.property("bank");
        expect(res.body.bank).to.be.an("array");
      });
    done();
  });

  it("POST Booking Page", (done) => {
    const image = __dirname + "/buktibayar.jpeg";
    const booking = {
      image,
      idItem: "5e96cbe292b97300fc902222",
      duration: "2",
      bookingDateStart: "9-8-2020",
      bookingDateEnd: "11-8-2020",
      firstName: "ibu",
      lastName: "budi",
      email: "ibubudinaikhaji@gmail.com",
      phoneNumber: "086969696969",
      accountHolder: "ayahbudi",
      bankFrom: "CIMB",
    };
    chai
      .request(app)
      .post("/api/v1/member/booking-page")
      .field("bookingDateStart", booking.bookingDateStart)
      .field("bookingDateEnd", booking.bookingDateEnd)
      .field("duration", booking.duration)
      .field("firstName", booking.firstName)
      .field("lastName", booking.lastName)
      .field("email", booking.email)
      .field("phoneNumber", booking.phoneNumber)
      .field("accountHolder", booking.accountHolder)
      .field("bankFrom", booking.bankFrom)
      .attach("image", fs.readFileSync(booking.image), "buktibayar.jpeg")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Success");
        expect(res.body).to.have.property("imageId");
        expect(res.body).to.have.property("booking");
        expect(res.body.booking).to.have.all.keys(
          "payments",
          "_id",
          "bookingStartDate",
          "bookingEndDate",
          "invoice",
          "total",
          "memberId",
          "itemId",
          "__v"
        );
        expect(res.body.booking.payments).to.have.all.keys(
          "status",
          "proofPayment",
          "bankFrom",
          "accountHolder"
        );
        expect(res.body.booking.itemId).to.have.all.keys(
          "_id",
          "title",
          "price",
          "duration"
        );
      });
    done();
  });
});
