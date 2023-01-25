const express = require("express");
const router = express.Router();
const { Group, sequelize, Membership, GroupImage } = require("../../db/models");

router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll();

    const NumMembers = await Promise.all(
      groups.map(async (group) => {
        const numMembers = await Membership.count({
          where: { groupId: group.id },
        });
        return { ...group.dataValues, numMembers };
      })
    );

    const NumMembersPreviewImage = await Promise.all(
      NumMembers.map(async (group) => {
        const previewImage = await GroupImage.findOne({
          where: { groupId: group.id, preview: true },
        });

        return { ...group, previewImage: previewImage.dataValues.url };
      })
    );

    return res.json({ Groups: NumMembersPreviewImage });
  } catch (err) {
    console.log(err);
    return res.json({ message: err });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, about, type, private, city, state } = req.body;
    const { id } = req.user;

    const newGroup = await Group.create({
      name,
      about,
      type,
      private,
      city,
      state,
      organizerId: id,
    });

    const membership = await Membership.create({
      userId: id,
      groupId: newGroup.id
    });

    return res.status(201).json(newGroup);
  } catch (err) {
    console.log(err);
    return res.status.json({ message: err }); // come back to this later and work on error handling
    /*
    Example of error handling
    {
  "message": "Validation Error",
  "statusCode": 400,
  "errors": {
    "name": "Name must be 60 characters or less",
    "about": "About must be 50 characters or more",
    "type": "Type must be 'Online' or 'In person'",
    "private": "Private must be a boolean",
    "city": "City is required",
    "state": "State is required",
  }
}
    */
  }
});

module.exports = router;
