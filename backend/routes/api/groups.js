const express = require("express");
const router = express.Router();
const { Group, sequelize, Membership, GroupImage } = require("../../db/models");



router.get("/", async (req, res, next) => {
  try {
    const groups = await Group.findAll();

    const numMembers = await Promise.all(
      groups.map(async (group) => {
        const numMembers = await Membership.count({
          where: { groupId: group.id },
        });
        return { ...group.dataValues, numMembers };
      })
    );


    const combinedValues = await Promise.all(
      numMembers.map(async (group) => {

        const previewImage = await GroupImage.findOne({
          where: { groupId: group.id, preview: true },
        });

        return { ...group, previewImage: previewImage.dataValues.url };

      })

    );


    return res.json({ Groups: combinedValues });
  } catch (err) {
    console.log(err);
    return res.json({ message: err });
  }
});







module.exports = router;
