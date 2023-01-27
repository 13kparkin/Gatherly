const express = require("express");
const router = express.Router();
const {
  Event,
  Group,
  sequelize,
  Membership,
  GroupImage,
  User,
  Venue,
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
      res.status(401)
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
    res.status(200)
    return res.json({ Groups: NumMembersPreviewImage });
  } catch (err) {
    console.log(err);
    res.status(500)
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
    res.status(401)
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
    res.status(401)
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
      res.status(404)
      return res.json(err);
    } else if (group.organizerId === id) {
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
      res.status(403)
      return res.json(err);
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500)
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
    res.status(401)
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
      res.status(404)
      return res.json(err);
    } else if (group.organizerId === id) {
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
    } else {
      const err = {};
      err.message = "Forbidden";
      err.statusCode = 403;
      res.status(403)
      return res.json(err);
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(400)
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
    res.status(401)
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
    return res.json({ Groups: filteredGroups2 });
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500)
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});

// finished route
router.get("/:groupId", async (req, res, next) => {
  const { user } = req;
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const numMembers = await Membership.count({
      where: { groupId },
    });
    const groupImages = await GroupImage.findAll({
      where: { groupId },
    });
    const organizer = await User.findByPk(group.organizerId);
    const venues = await Venue.findAll({
      where: { groupId },
    });

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404)
      return res.json(err);
    } else {
      const finalGroup = {
        ...group.dataValues,
        numMembers,
        groupImages,
        organizer: {
          id: organizer.id,
          firstName: organizer.firstName,
          lastName: organizer.lastName,
        },
        venues,
      };

      res.status(200);
      return res.json(finalGroup);
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500)
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});

// finished route
router.get("/:groupId/venues", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401)
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const { id } = req.user;

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404)
      return res.json(err);
    }

    if (group.organizerId === id) {
      const venues = await Venue.findAll({
        where: { groupId },
      });

      res.status(200);
      return res.json({ Venues: venues });
    } else {
      const membership = await Membership.findOne({
        where: { userId: id, groupId, status: "co-host" },
      });

      if (!membership) {
        const err = {};
        err.message = "Forbidden";
        err.statusCode = 403;
        res.status(403)
        return res.json(err);
      } else {
        const venues = await Venue.findAll({
          where: { groupId },
        });

        res.status(200);
        return res.json({ Venues: venues });
      }
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500);
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});

// finished route
router.post("/:groupId/venues", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401)
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const { id } = req.user;

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404)
      return res.json(err);
    }

    // exclude createdAt and updatedAt

    if (group.organizerId === id) {
      const { address, city, state, zip, lat, lng } = req.body;
      const venue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng,
      });

      // error handling object
      let statusCode;
      const err = {
        message: "validation error",
        statusCode,
        errors: {
          address,
          city,
          state,
          lat,
          lng,
        },
      };
      if (
        !address ||
        !city ||
        !state ||
        lat >= 90 ||
        lat <= -90 ||
        lng >= 180 ||
        lng <= -180
      ) {
        statusCode = err.statusCode = 400;
        if (!address) {
          err.errors.address = "Street address is required";
          err.statusCode = statusCode;
        } else if (!city) {
          err.errors.city = "City is required";
          err.statusCode = statusCode;
        } else if (!state) {
          err.errors.state = "State is required";
          err.statusCode = statusCode;
        } else if (lat >= 90 || lat <= -90) {
          err.errors.lat = "Latitude is not valid";
          err.errors.statusCode = statusCode;
        } else if (lng >= 180 || lng <= -180) {
          err.errors.lng = "Longitude is not valid";
          err.statusCode = statusCode;
        }
        res.status(400)
        return res.json(err);
      }

      const finalVenue = {
        id: venue.id,
        groupId: venue.groupId,
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng,
      };

      res.status(200);
      return res.json(finalVenue);
    } else {
      const membership = await Membership.findOne({
        where: { userId: id, groupId, status: "co-host" },
      });

      if (!membership) {
        const err = {};
        err.message = "Forbidden";
        err.statusCode = 403;
        res.status(403)
        return res.json(err);
      } else {
        const { address, city, state, zip, lat, lng } = req.body;
        const venue = await Venue.create({
          groupId,
          address,
          city,
          state,
          lat,
          lng,
        });

        const finalVenue = {
          id: venue.id,
          groupId: venue.groupId,
          address: address,
          city: city,
          state: state,
          lat: lat,
          lng: lng,
        };

        res.status(200);
        return res.json(finalVenue);
      }
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500);
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});

// finished route
router.post("/:groupId/events", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401)
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const { id } = req.user;

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404)
      return res.json(err);
    }

    if (group.organizerId === id) {
      let {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      } = req.body;

      const lowerCaseType = type.toLowerCase();
      const event = await Event.create({
        groupId: groupId,
        venueId,
        name,
        type: lowerCaseType,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });

      let statusCode;
      const err = {
        message: "validation error",
        statusCode,
        errors: {
          venueId,
          name,
          type,
          capacity,
          price,
          description,
          startDate,
          endDate,
        },
      };
      const today = new Date();
      startDate = new Date(startDate);
      endDate = new Date(endDate);

      // query for venueId
      const venue = await Venue.findByPk(venueId);

      if (
        !venueId ||
        !venue ||
        name < 5 ||
        type === "online" ||
        type === "in person" ||
        !Number.isInteger(capacity) ||
        !description ||
        startDate > today ||
        endDate < startDate
      ) {
        statusCode = err.statusCode = 400;
        if (!venueId || !venue) {
          err.errors.venueId = "Venue does not exist";
          err.statusCode = statusCode;
        } else if ( name < 5) {
          err.errors.name = "Name must be at least 5 characters";
          err.statusCode = statusCode;
        } else if (type === "online" || type === "in person") {
          err.errors.type = "Type must be Online or In person";
          err.statusCode = statusCode;
        } else if (!Number.isInteger(capacity)) {
          err.errors.capacity = "Capacity must be an integer";
          err.statusCode = statusCode;
        } else if (!price) {
          err.errors.price = "Price is invalid";
          err.statusCode = statusCode;
        } else if (!description) {
          err.errors.description = "Description is required";
          err.statusCode = statusCode;
        } else if (startDate > today) {
          err.errors.startDate = "Start date must be in the future";
          err.statusCode = statusCode;
        } else if ( endDate < startDate) {
          err.errors.endDate = "End date is less than start date";
          err.statusCode = statusCode;
        }
        res.status(400);
        return res.json(err);
      }

      const finalEvent = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
      };

      res.status(200);
      return res.json(finalEvent);
    } else {
      const membership = await Membership.findOne({
        where: { userId: id, groupId, status: "co-host" },
      });

      if (!membership) {
        const err = {};
        err.message = "Forbidden";
        err.statusCode = 403;
        res.status(403)
        return res.json(err);
      } else {
        let {
          venueId,
          name,
          type,
          capacity,
          price,
          description,
          startDate,
          endDate,
        } = req.body;

        const lowerCaseType = type.toLowerCase();
        const event = await Event.create({
          groupId: groupId,
          venueId,
          name,
          type: lowerCaseType,
          capacity,
          price,
          description,
          startDate,
          endDate,
        });

        // error handling object
        let statusCode;
        const err = {
          message: "validation error",
          statusCode,
          errors: {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
          },
        };

        const today = new Date();
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        if (
          !venueId ||
          name < 5 ||
          type === "online" ||
          type === "in person" ||
          !Number.isInteger(capacity) ||
          !description ||
          startDate > today ||
          endDate < startDate
        ) {
          statusCode = err.statusCode = 400;
          if (!venueId) {
            err.errors.venueId = "Venue does not exist";
            err.statusCode = statusCode;
          } else if ( name < 5) {
            err.errors.name = "Name must be at least 5 characters";
            err.statusCode = statusCode;
          } else if (type === "online" || type === "in person") {
            err.errors.type = "Type must be Online or In person";
            err.statusCode = statusCode;
          } else if (!Number.isInteger(capacity)) {
            err.errors.capacity = "Capacity must be an integer";
            err.statusCode = statusCode;
          } else if (!price) {
            err.errors.price = "Price is invalid";
            err.statusCode = statusCode;
          } else if (!description) {
            err.errors.description = "Description is required";
            err.statusCode = statusCode;
          } else if (startDate > today) {
            err.errors.startDate = "Start date must be in the future";
            err.statusCode = statusCode;
          } else if ( endDate < startDate) {
            err.errors.endDate = "End date is less than start date";
            err.statusCode = statusCode;
          }
          res.status(400);
          return res.json(err);
        }

        const finalEvent = {
          id: event.id,
          groupId: event.groupId,
          venueId: event.venueId,
          name: event.name,
          type: event.type,
          capacity: event.capacity,
          price: event.price,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
        };

        res.status(200);
        return res.json(finalEvent);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});





module.exports = router;
