const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middleware/multer");
const isLogin = require("../middleware/auth");

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.use(isLogin);
router.get("/signout", adminController.actionSignout);
router.get("/dashboard", adminController.viewDashboard);
// endpoint category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.post("/category/edit", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);
// endpoint bank
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);
// endpoint item
router.get("/item", adminController.viewItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id", adminController.deleteItem);
// endpoint detail
router.get("/item/show-detail-item/:itemId", adminController.showItemDetails);
router.post("/item/feature", uploadMultiple, adminController.addFeature);
router.put("/item/edit/feature", uploadMultiple, adminController.editFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);

router.post("/item/add/activity", uploadMultiple, adminController.addActivity);
router.put("/item/edit/activity", uploadMultiple, adminController.editActivity);
router.delete("/item/:itemId/activity/:id", adminController.deleteActivity);

router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirmation", adminController.actionConfirmation);
router.put("/booking/:id/reject", adminController.actionReject);

module.exports = router;
