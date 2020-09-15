const Category = require("../models/Category");
const Item = require("../models/Item");
const Activity = require("../models/Activity");
const Booking = require("../models/Booking");
const Bank = require("../models/Bank");
const Member = require("../models/Member");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city imageId price")
        .limit(5)
        .populate({
          path: "imageId",
          select: "_id imageUrl",
          perDocumentLimit: 1,
        });
      const travelers = await Booking.find();
      const treasures = await Activity.find();
      const cities = await Item.find();
      const categories = await Category.find()
        .limit(3)
        .select("_id name")
        .populate({
          path: "itemId",
          options: { sort: { sumBooking: -1 } },
          select: " _id imageId country city isPopular title sumBooking",
          perDocumentLimit: 4,
          populate: {
            perDocumentLimit: 1,
            path: "imageId",
            select: "_id imageUrl",
          },
        });

      for (let i = 0; i < categories.length; i++) {
        for (let x = 0; x < categories[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: categories[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (categories[i].itemId[0] === categories[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasures: treasures.length,
          cities: cities.length,
        },
        mostPicked,
        categories,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  detailPage: async (req, res) => {
    const { id } = req.params;
    try {
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "imageId", select: "_id imageUrl" });
      const bank = await Bank.find();
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };
      res.status(200).json({
        ...item._doc,
        testimonial,
        bank,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error message in internal server" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      bookingDateStart,
      bookingDateEnd,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    if (!req.file) {
      res.status(404).json({ message: "image not found" });
    }

    if (
      idItem === undefined ||
      duration === undefined ||
      bookingDateStart === undefined ||
      bookingDateEnd === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      res.status(404).json({ message: "Lengkapi Field" });
    }

    const item = await Item.findOne({ _id: idItem });

    if (!item) {
      res.status(404).json({ message: "Item Not Found" });
    }

    item.sumBooking += 1;
    await item.save();

    let total = item.price * duration;
    let tax = total * 0.1;
    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    const newBooking = {
      bookingStartDate: bookingDateStart,
      bookingEndDate: bookingDateEnd,
      invoice,
      total: (total += tax),
      memberId: member.id,
      itemId: {
        _id: item.id,
        title: item.title,
        price: item.price,
        duration: duration,
      },
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: "Success", booking });
  },
};
