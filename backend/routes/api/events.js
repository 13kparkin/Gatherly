const express = require("express");
const router = express.Router();
const {
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
router.post("/:eventId/images", async (req, res) => {
  const { eventId } = req.params;
  const { user } = req;
  const { url, preview } = req.body;
  const { id } = req.user;

  const event = await Event.findByPk(eventId);

  if (!event) {
    const err = {};
    err.message = "Event couldn't be found";
    err.statusCode = 404;
    res.status(404);
    return res.json(err);
  }

  const membership = await Membership.findOne({
    where: { userId: id, groupId: event.groupId },
  });

  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }

  if (!membership) {
    const err = {};
    err.message = "Forbidden";
    err.statusCode = 403;
    res.status(403);
    return res.json(err);
  }

  const image = await EventImage.create({
    eventId: event.id,
    url,
    preview,
  });

  const finalImage = {
    id: image.id,
    url: image.url,
    preview: image.preview,
  };

  res.status(200);
  return res.json(finalImage);
});

// need to come back to and fix error for forien key constraint
router.put("/:eventId", async (req, res) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    const { id } = req.user;


    if (!event) {
      const err = {};
      err.message = "Event couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const groupId = event.dataValues.groupId;
    const group = await Group.findByPk(groupId);


    if (group.dataValues.organizerId === id) {
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

      const updatedEvent = await event.update({
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

      if (!event.dataValues.venueId) {
        const err = {};
        err.message = "Venue couldn't be found";
        err.statusCode = 404;
        res.status(404);
        return res.json(err);
      }

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
        } else if (name < 5) {
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
        } else if (endDate < startDate) {
          err.errors.endDate = "End date is less than start date";
          err.statusCode = statusCode;
        }
        res.status(400);
        return res.json(err);
      }

      const finalEvent = {
        id: updatedEvent.id,
        groupId: updatedEvent.groupId,
        venueId: updatedEvent.venueId,
        name: updatedEvent.name,
        type: updatedEvent.type,
        capacity: updatedEvent.capacity,
        price: updatedEvent.price,
        description: updatedEvent.description,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
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
        const updatedEvent = await event.update({
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

        if (!event.dataValues.venueId) {
            const err = {};
            err.message = "Venue couldn't be found";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
          }

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
          } else if (name < 5) {
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
          } else if (endDate < startDate) {
            err.errors.endDate = "End date is less than start date";
            err.statusCode = statusCode;
          }
          res.status(400);
          return res.json(err);
        }

        const finalEvent = {
          id: updatedEvent.id,
          groupId: updatedEvent.groupId,
          venueId: updatedEvent.venueId,
          name: updatedEvent.name,
          type: updatedEvent.type,
          capacity: updatedEvent.capacity,
          price: updatedEvent.price,
          description: updatedEvent.description,
          startDate: updatedEvent.startDate,
          endDate: updatedEvent.endDate,
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
