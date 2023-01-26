const express = require("express");
const router = express.Router();
const {
  Group,
  sequelize,
  Membership,
  GroupImage,
  User,
} = require("../../db/models");

//finished route
router.get("/", async (req, res, next) => {
  try {
    // get current user
    const { user } = req;
    if (!user) {
      err = {};
      err.message = "Authentication required";
      err.statusCode = 401;
      return res.json(err);
    }

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

        if (!previewImage) {
          return { ...group, previewImage: "No preview image inclued" };
        }

        return { ...group, previewImage: previewImage.dataValues.url };
      })
    );

    return res.json({ Groups: NumMembersPreviewImage });
  } catch (err) {
    console.log(err);
    return res.json({ message: err });
  }
});

// needs work on error handling // todo: create object to start building info for err response
router.post("/", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    return res.json(err);
  }

  try {
    const { name, about, type, private, city, state } = req.body;
    const { id } = req.user;
    const user = await User.findByPk(id);

    const lowerCaseType = type.toLowerCase();


    if (user) {
      const newGroup = await Group.create({
        name,
        about,
        type: lowerCaseType,
        private,
        city,
        state,
        organizerId: id,
      });

      // this membersip is the organizer
      const membership = await Membership.create({
        userId: id,
        groupId: newGroup.id,
        status: "member",
      });
      res.status(201);
      return res.json(newGroup);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    return res.json({ message: "Validation Error", statusCode: 400 }); 
  }
});

// finished route
router.post("/:groupId/images", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const { url, preview } = req.body;
    const { id } = req.user;
    const group = await Group.findByPk(groupId);
    const usedGroupImage = await GroupImage.findOne({
      where: { groupId },
    });

    // could do with some clean up later but works for now

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      return res.json(err);
    } 
    
    else if (usedGroupImage) {
      const err = {};
      err.message = "Group already has a preview image";
      err.statusCode = 400;
      return res.json(err);
    } 
    
    else if (group.organizerId === id) {
      const newImage = await GroupImage.create({
        url,
        preview,
        groupId,
      });

      const finalNewImage = await GroupImage.findByPk(newImage.id, {
        attributes: ["id", "url", "preview"],
      });

      res.status(200);
      return res.json(finalNewImage);
    } else {
      const err = {};
      err.message = "Forbidden";
      err.statusCode = 403;
      return res.json(err);
    }
  } catch (err) {
    // all other errors
    console.log(err);
    return res.json({ message: err });
  }
});


// finished route // Question about checking errors that come from sequelize db
router.put("/:groupId", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const { id } = req.user;
    const { name, about, type, private, city, state } = req.body;
    const group = await Group.findByPk(groupId);
    const lowerCaseType = type.toLowerCase();

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      return res.json(err);
    } 
    
    else if (group.organizerId === id) {
      const updatedGroup = await group.update({
        name,
        about,
        type: lowerCaseType,
        private,
        city,
        state,
      });

      

      res.status(200);
      return res.json(updatedGroup);

    } 
    
    else {
      const err = {};
      err.message = "Forbidden";
      err.statusCode = 403;
      return res.json(err);
    }

  } catch (err) {
    // all other errors
    console.log(err);
    return res.json({ message: "Validation Error", statusCode: 400 });
  }
});

// finished route // needs more testing when membership stuff is flushed out // also could do with some clean up. Research how to create a helper function for getAllGroups.
router.get("/current", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    return res.json(err);
  }
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
    
          if (!previewImage) {
            return { ...group, previewImage: "No preview image inclued" };
          }
    
          return { ...group, previewImage: previewImage.dataValues.url };
        })
      );
    
      const allGroups = NumMembersPreviewImage;


      const memberships = await Membership.findAll({
        where: { userId: user.id, status: "member" },
      });


      const filteredGroups = allGroups.filter((group) => {
        return memberships.some((membership) => {
          return membership.groupId === group.id;
        });
      });

      const filteredGroups2 = allGroups.filter((group) => {
        return group.organizerId === user.id || filteredGroups.includes(group);
      });    

    res.status(200);
    return res.json({Groups: filteredGroups2});
  } catch (err) {
    // all other errors
    console.log(err);
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});





module.exports = router;
