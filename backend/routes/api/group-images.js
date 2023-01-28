const express = require("express");
const router = express.Router();
const {
  Attendance,
  EventImage,
  Event,
  Group,
  sequelize,
  Membership,
  GroupImage,
  User,
  Venue,
} = require("../../db/models");

// finished route
router.delete("/:imageId", async (req, res) => {
    const { imageId } = req.params;
    const { user } = req;
    const userId = user.id;
  
  
    if (!user) {
      const err = {};
      err.message = "Authentication required";
      err.statusCode = 401;
      res.status(401);
      return res.json(err);
    }
    
    try {
      const image = await GroupImage.findByPk(imageId);
      if (!image) {
        const err = {};
        err.message = "Group Image couldn't be found";
        err.statusCode = 404;
        res.status(404);
        return res.json(err);
      }
  
      const group = await Group.findByPk(image.groupId);
      const organizerId = group.organizerId;
      
      const coHost = await Membership.findOne({
        where: {
          groupId: image.groupId,
          userId: userId,
          status: "co-host",
        },
      });
  
      if (organizerId !== userId) {
        if (!coHost) {
          const err = {};
          err.message = "Authorization required";
          err.statusCode = 403;
          res.status(403);
          return res.json(err);
        }
      }
  
      await image.destroy();
  
      res.status(200);
      return res.json({ message: "Successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500);
      return res.json(err);
    }
  });







module.exports = router;