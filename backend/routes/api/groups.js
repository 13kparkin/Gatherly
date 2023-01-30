const express = require("express");
const { FLOAT } = require("sequelize");
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

//finished route
router.get("/", async (req, res, next) => {
  try {
    // get current user
    const { user } = req;
    if (!user) {
      err = {};
      err.message = "Authentication required";
      err.statusCode = 401;
      res.status(401);
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
    res.status(200);
    return res.json({ Groups: NumMembersPreviewImage });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({ message: err });
  }
});

// finished route
router.post("/", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }

  try {
    let { name, about, type, private, city, state } = req.body;
    const { id } = req.user;
    const user = await User.findByPk(id);
    private = private.toString();
    const lowerCasePrivate = private.toLowerCase();

    const lowerCaseType = type.toLowerCase();

    if (
      name.length >= 60 ||
      name.length === 0 ||
      about.length < 50 ||
      (lowerCaseType !== "online" && lowerCaseType !== "in person") ||
      (lowerCasePrivate !== "true" && lowerCasePrivate !== "false") ||
      !city ||
      !state
    ) {
      const err = {};
      err.errors = {};
      err.message = "Validation Error";
      if (name.length >= 60 || name.length === 0) {
        err.errors.name = "Name must be 60 characters or less and not empty";
        err.statusCode = 400;
      }
      if (about.length < 50) {
        err.errors.about = "About must be 50 characters or more";
        err.statusCode = 400;
      }
      if (lowerCaseType !== "online" && lowerCaseType !== "in person") {
        err.errors.type = "Type must be 'Online' or 'In person'";
        err.statusCode = 400;
      }
      if (lowerCasePrivate !== "true" && lowerCasePrivate !== "false") {
        err.errors.private = "Private must be a boolean";
        err.statusCode = 400;
      }
      if (!city) {
        err.errors.city = "City is required";
        err.statusCode = 400;
      }
      if (!state) {
        err.errors.state = "State is required";
        err.statusCode = 400;
      }
      res.status(400);
      return res.json(err);
    }
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
        status: "co-host",
      });
      res.status(201);
      return res.json(newGroup);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({ message: "Server Error", statusCode: 500 });
  }
});

// finished route
router.post("/:groupId/images", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
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
      res.status(404);
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
      res.status(403);
      return res.json(err);
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500);
    return res.json({ message: err });
  }
});

// finished route
router.put("/:groupId", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const { id } = req.user;
    let { name, about, type, private, city, state } = req.body;
    const group = await Group.findByPk(groupId);
    const lowerCaseType = type.toLowerCase();
    private = private.toString();
    const lowerCasePrivate = private.toLowerCase();

    console.log(about.length);

    if (
      name.length >= 60 ||
      name.length === 0 ||
      about.length <= 50 ||
      (lowerCaseType !== "online" && lowerCaseType !== "in person") ||
      (lowerCasePrivate !== "true" && lowerCasePrivate !== "false") ||
      !city ||
      !state
    ) {
      const err = {};
      err.errors = {};
      err.message = "Validation Error";
      if (name.length >= 60 || name.length === 0) {
        err.errors.name = "Name must be 60 characters or less and not empty";
        err.statusCode = 400;
      }
      if (about.length <= 50) {
        err.errors.about = "About must be 50 characters or more";
        err.statusCode = 400;
      }
      if (lowerCaseType !== "online" && lowerCaseType !== "in person") {
        err.errors.type = "Type must be 'Online' or 'In person'";
        err.statusCode = 400;
      }
      if (lowerCasePrivate !== "true" && lowerCasePrivate !== "false") {
        err.errors.private = "Private must be a boolean";
        err.statusCode = 400;
      }
      if (!city) {
        err.errors.city = "City is required";
        err.statusCode = 400;
      }
      if (!state) {
        err.errors.state = "State is required";
        err.statusCode = 400;
      }
      res.status(400);
      return res.json(err);
    }

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
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
      res.status(403);
      return res.json(err);
    }
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500);
    return res.json({ message: "Server Error", statusCode: 500 });
  }
});

// finished route
router.get("/current", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
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
    res.status(500);
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});

// finished route
router.get("/:groupId", async (req, res, next) => {
  const { user } = req;
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

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

    const finalGroup = {
      ...group.dataValues,
      numMembers,
      GroupImages: groupImages.map((groupImage) => {
        return {
          id: groupImage.id,
          groupId: groupImage.groupId,
          url: groupImage.url,
          preview: groupImage.preview,
        };
      }),
      Organizer: {
        id: organizer.id,
        firstName: organizer.firstName,
        lastName: organizer.lastName,
      },
      Venues: venues.map((venue) => {
        return {
          id: venue.id,
          groupId: venue.groupId,
          name: venue.name,
          address: venue.address,
          city: venue.city,
          state: venue.state,
          lat: venue.lat,
          lng: venue.lng,
        };
      }),
    };

    res.status(200);
    return res.json(finalGroup);
  } catch (err) {
    // all other errors
    console.log(err);
    res.status(500);
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
    res.status(401);
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
      res.status(404);
      return res.json(err);
    }

    if (group.organizerId === id) {
      const venues = await Venue.findAll({
        where: { groupId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
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
        res.status(403);
        return res.json(err);
      } else {
        const venues = await Venue.findAll({
          where: { groupId },
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
    res.status(401);
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const { id } = req.user;
    const { address, city, state, lat, lng } = req.body;

    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    if (group.organizerId === id) {
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
        }
        if (!city) {
          err.errors.city = "City is required";
          err.statusCode = statusCode;
        }
        if (!state) {
          err.errors.state = "State is required";
          err.statusCode = statusCode;
        }
        if (lat >= 90 || lat <= -90) {
          err.errors.lat = "Latitude is not valid";
          err.errors.statusCode = statusCode;
        }
        if (lng >= 180 || lng <= -180) {
          err.errors.lng = "Longitude is not valid";
          err.statusCode = statusCode;
        }
        res.status(400);
        return res.json(err);
      }

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
    } else {
      const membership = await Membership.findOne({
        where: { userId: id, groupId, status: "co-host" },
      });

      if (!membership) {
        const err = {};
        err.message = "Forbidden";
        err.statusCode = 403;
        res.status(403);
        return res.json(err);
      } else {
        const { address, city, state, lat, lng } = req.body;
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
    res.status(401);
    return res.json(err);
  }
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    const { id } = req.user;
    let { price } = req.body;

    const priceFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      rounding: "floor",
    });


    function priceChecker(num) {
      const numArr = num.toString().split("");

      const decimalIndex = numArr.indexOf(".");

      if (decimalIndex === -1) {

        price = priceFormatter.format(price);
        price = Number(price)
        return true;
      }

      const numAfterDecimal = numArr.length - decimalIndex - 1;

      if (numAfterDecimal > 2) {
        return false;
      } else {
        price = priceFormatter.format(price);
        price = Number(price)
        return true;
      }
    }
    console.log(priceChecker(price));
    
    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
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
      const venue = await Venue.findByPk(venueId);

      const today = new Date();
      startDate = new Date(startDate);
      endDate = new Date(endDate);

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

      if (
        !venue ||
        name < 5 ||
        (type !== "online" && type !== "in person") ||
        !Number.isInteger(capacity) || !Number.isFinite(price) ||
        priceChecker(price) === false ||
        !description ||
        today > startDate ||
        endDate < startDate
      ) {
        statusCode = err.statusCode = 400;
        if (!venue) {
          err.errors.venueId = "Venue does not exist";
          err.statusCode = statusCode;
        }
        if (name < 5) {
          err.errors.name = "Name must be at least 5 characters";
          err.statusCode = statusCode;
        }
        if (type !== "online" && type !== "in person") {
          err.errors.type = "Type must be Online or In person";
          err.statusCode = statusCode;
        }
        if (!Number.isInteger(capacity)) {
          err.errors.capacity = "Capacity must be an integer";
          err.statusCode = statusCode;
        }
        if (priceChecker(price) === false || !Number.isFinite(price)) {
          err.errors.price =
            "Price is invalid";
          err.statusCode = statusCode;
        }
        if (!description) {
          err.errors.description = "Description is required";
          err.statusCode = statusCode;
        }
        if (today > startDate) {
          err.errors.startDate = "Start date must be in the future";
          err.statusCode = statusCode;
        }
        if (endDate <= startDate) {
          err.errors.endDate = "End date is less than start date";
          err.statusCode = statusCode;
        }
        res.status(400);
        return res.json(err);
      }

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

      await Attendance.create({
        userId: id,
        eventId: event.id,
        status: "member",
      });

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
        res.status(403);
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
          !venue ||
          name < 5 ||
          (type !== "online" && type !== "in person") ||
          !Number.isInteger(capacity) || !Number.isFinite(price) ||
          priceChecker(price) === false ||
          !description ||
          today > startDate ||
          endDate < startDate
        ) {
          statusCode = err.statusCode = 400;
          if (!venue) {
            err.errors.venueId = "Venue does not exist";
            err.statusCode = statusCode;
          }
          if (name < 5) {
            err.errors.name = "Name must be at least 5 characters";
            err.statusCode = statusCode;
          }
          if (type !== "online" && type !== "in person") {
            err.errors.type = "Type must be Online or In person";
            err.statusCode = statusCode;
          }
          if (!Number.isInteger(capacity)) {
            err.errors.capacity = "Capacity must be an integer";
            err.statusCode = statusCode;
          }
          if (priceChecker(price) === false || !Number.isFinite(price)) {
            err.errors.price =
              "Price is invalid";
            err.statusCode = statusCode;
          }
          if (!description) {
            err.errors.description = "Description is required";
            err.statusCode = statusCode;
          }
          if (today > startDate) {
            err.errors.startDate = "Start date must be in the future";
            err.statusCode = statusCode;
          }
          if (endDate <= startDate) {
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

        const attendance = await Attendance.create({
          userId: id,
          eventId: event.id,
          status: "member",
        });



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

// finished route
router.get("/:groupId/events", async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }
    const events = await Event.findAll({
      where: {
        groupId,
      },
      include: [
        {
          model: Group,
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state"],
        },
        {
          model: EventImage,
          attributes: ["id", "url"],
        },
      ],
    });

    if (events.length === 0) {
      const err = {};
      err.message = "No events found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const eventIds = events.map((event) => event.id);

    const numAttending = await Attendance.findAll({
      where: {
        eventId: eventIds,
      },
      attributes: [
        "eventId",
        [sequelize.fn("COUNT", sequelize.col("eventId")), "numAttending"],
      ],
      group: ["eventId"],
    });

    const finalEvents = events.map((event) => {
      let eventNumAttending = numAttending.find(
        (num) => num.eventId === event.id
      );

      if (!eventNumAttending || numAttending.length === 0) {
        eventNumAttending = { numAttending: 0 };
      } else {
        eventNumAttending = {
          numAttending: numAttending[0].dataValues.numAttending,
        };
      }

      let previewImage = event.EventImages.find((image) => image.url);
      if (!previewImage) {
        previewImage = { url: null };
      }
      return {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: eventNumAttending.numAttending,
        previewImage: previewImage.url,
        Group: event.Group,
        Venue: event.Venue,
      };
    });

    res.status(200);
    return res.json({ Events: finalEvents });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.post("/:groupId/membership", async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;

  
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = {};
      err.message = "Group could not be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const membership = await Membership.findOne({
      where: {
        groupId,
        userId,
      },
    });

    const organizer = await Group.findOne({
      where: {
        id: groupId,
        organizerId: userId,
      },
    });

    if (membership) {
      if (membership.status === "co-host") {
        const err = {};
        err.message = "User is already a co-host";
        err.statusCode = 400;
        res.status(400);
        return res.json(err);
      }
      if (membership.status === "member") {
        if (organizer) {
          const err = {};
          err.message = "User is the organizer";
          err.statusCode = 400;
          res.status(400);
          return res.json(err);
        }
        if (membership.status === "member") {
          const err = {};
          err.message = "User is already a member of the group";
          err.statusCode = 400;
          res.status(400);
          return res.json(err);
        }
      }
      if (membership.status === "pending") {
        const err = {};
        err.message = "Membership has already been requested";
        err.statusCode = 400;
        res.status(400);
        return res.json(err);
      }
    }

    const newMembership = await Membership.create({
      groupId,
      userId,
      status: "pending",
    });

    const finalMembership = {
      id: newMembership.id,
      groupId: newMembership.groupId,
      userId: newMembership.userId,
      status: newMembership.status,
    };

    res.status(200);
    return res.json(finalMembership);
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.put("/:groupId/membership", async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;
  let { memberId, status } = req.body;
  status = status.toLowerCase();

  const users = await User.findAll({
    where: {
      id: memberId,
    },
  });

  if (users.length === 0) {
    const err = {};
    err.message = "Validation Error";
    err.statusCode = 400;
    err.errors = { memberId: "User couldn't be found" };
    res.status(400);
    return res.json(err);
  }

  

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = {};
      err.message = "Group could not be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const membership = await Membership.findOne({
      where: {
        groupId,
        userId: memberId,
      },
    });

    if (!membership) {
      const err = {};
      err.message = "Membership between the user and the group does not exits";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    if (status === "pending") {
      const err = {};
      err.message = "Cannot change a membership status to pending";
      err.statusCode = 400;
      res.status(400);
      return res.json(err);
    }

    const organizer = await Group.findOne({
      where: {
        id: groupId,
        organizerId: userId,
      },
    });

    const coHost = await Membership.findOne({
      where: {
        groupId,
        userId: userId,
        status: "co-host",
      },
    });

    if (status === "member") {
      if (!organizer) {
        if (coHost) {
          const updatedMembership = await membership.update({
            status,
          });
        } else {
          const err = {};
          err.message = "Authorization required";
          err.statusCode = 403;
          res.status(403);
          return res.json(err);
        }
      }
    }

    if (status === "co-host") {
      if (!organizer) {
        const err = {};
        err.message = "Authorization required";
        err.statusCode = 403;
        res.status(403);
        return res.json(err);
      }
    }

    const updatedMembership = await membership.update({
      status,
    });

    const finalMembership = {
      id: membership.id,
      groupId: membership.groupId,
      userId: membership.userId,
      status: membership.status,
    };

    res.status(200);
    return res.json(finalMembership);
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.get("/:groupId/members", async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }

  const userId = user.id;

  
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const organizer = await Group.findOne({
      where: {
        organizerId: userId,
      },
    });

    const coHost = await Membership.findOne({
      where: {
        groupId,
        userId: userId,
        status: "co-host",
      },
    });

    const memberships = await Membership.findAll({
      where: {
        groupId,
      },
      include: User,
    });

    const members = memberships.map((membership) => {
      const member = {
        id: membership.User.id,
        firstName: membership.User.firstName,
        lastName: membership.User.lastName,
        Membership: {
          status: membership.status,
        },
      };
      return member;
    });

    if (!organizer) {
      if (coHost) {
        res.status(200);
        return res.json({ Members: members });
      }
      const finalMembers = members.filter(
        (member) => member.Membership.status !== "pending"
      );
      res.status(200);
      return res.json({ Members: finalMembers });
    }

    res.status(200);
    return res.json({ Members: members });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.delete("/:groupId/membership", async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;
  const memberId = req.body.memberId;

  if (!memberId) {
    const err = {};
    err.message = "MemberId is required";
    err.statusCode = 400;
    res.status(400);
    return res.json(err);
  }

  

  const organizer = await Group.findOne({
    where: {
      id: groupId,
      organizerId: userId,
    },
  });

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const membership = await Membership.findOne({
      where: {
        groupId,
        userId: memberId,
      },
    });

    if (!membership) {
      const err = {};
      err.message = "Membership does not exist for this User";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const users = await User.findAll({
      where: {
        id: memberId,
      },
    });

    if (users.length === 0) {
      const err = {};
      err.message = "Validation Error";
      err.errors = { memberId: "User couldn't be found" };
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const coHost = await Membership.findOne({
      where: {
        groupId,
        userId: userId,
        status: "co-host",
      },
    });

    if (organizer !== userId) {
      if (coHost) {
        if (coHost.userId === memberId) {
          const err = {};
          err.message = "Cannot delete co-host";
          err.statusCode = 403;
          res.status(403);
          return res.json(err);
        }
      } else if (memberId === userId) {
        await membership.destroy();

        res.status(200);
        return res.json({
          message: "Successfully deleted membership from group",
        });
      } else {
        const err = {};
        err.message = "Authorization required";
        err.statusCode = 403;
        res.status(403);
        return res.json(err);
      }
    }

    if (
      organizer === userId ||
      memberId === userId ||
      coHost.userId === userId
    ) {
      await membership.destroy();

      res.status(200);
      return res.json({
        message: "Successfully deleted membership from group",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.delete("/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const { user } = req;

  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;

  

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      const err = {};
      err.message = "Group couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const organizerId = group.organizerId;

    if (organizerId !== userId) {
      const err = {};
      err.message = "Forbidden";
      err.statusCode = 403;
      res.status(403);
      return res.json(err);
    }

    await group.destroy();

    res.status(200);
    return res.json({ message: "Successfully deleted group", statusCode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

module.exports = router;
