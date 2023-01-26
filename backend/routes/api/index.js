// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const { restoreUser } = require("../../utils/auth.js");
const groupsRouter = require("./groups.js");
const venuesRouter = require("./venues.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

//routes
router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/groups", groupsRouter);
router.use("/venues", venuesRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
