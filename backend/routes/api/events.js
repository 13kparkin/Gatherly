const e = require("express");
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

// finished route
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
    if (err.name === "SequelizeForeignKeyConstraintError") {
      const err = {};
      err.message = "Venue couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
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

    // if there is numAttending for an event

    const finalEvents = events.map((event) => {
      let eventNumAttending = numAttending.find(
        (num) => num.eventId === event.id
      );

      if (!eventNumAttending) {
        eventNumAttending = { numAttending: 0 };
      }

      if (numAttending) {
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
        capacity: event.capacity,
        price: event.price,
        description: event.description,
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
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {
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

    if (!event) {
      const err = {};
      err.message = "Event couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const numAttending = await Attendance.findAll({
      where: {
        eventId: eventId,
      },
      attributes: [
        "eventId",
        [sequelize.fn("COUNT", sequelize.col("eventId")), "numAttending"],
      ],
      group: ["eventId"],
    });

    let eventNumAttending = numAttending.find(
      (num) => num.eventId === event.id
    );

    if (!eventNumAttending) {
      eventNumAttending = { numAttending: 0 };
    } else {
      if (numAttending) {
        eventNumAttending = {
          numAttending: numAttending[0].dataValues.numAttending,
        };
      }
    }
    if (event.EventImages.length === 0) {
      event.EventImages = null;
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
      numAttending: eventNumAttending.numAttending,
      Group: event.Group,
      Venue: event.Venue,
      EventImages: event.EventImages,
    };

    res.status(200);
    return res.json(finalEvent);
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.get("/:eventId/attendees", async (req, res) => {
  const { eventId } = req.params;
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
    const event = await Event.findByPk(eventId);

    if (!event) {
      const err = {};
      err.message = "Event couldn't be found";
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
        groupId: event.groupId,
        userId: userId,
        status: "co-host",
      },
    });

    const attendees = await Attendance.findAll({
      where: {
        eventId,
      },
    });

    const attendeeIds = attendees.map((attendee) => attendee.userId);

    const attendeeInfo = await User.findAll({
      where: {
        id: attendeeIds,
      },
      attributes: ["id", "firstName", "lastName"],
    });

    const finalAttendees = attendees.map((attendee) => {
      const attendeesInfo = attendeeInfo.find(
        (info) => info.id === attendee.userId
      );
      return {
        id: attendee.userId,
        firstName: attendeesInfo.firstName,
        lastName: attendeesInfo.lastName,
        Attendance: { status: attendee.status },
      };
    });

    if (!organizer) {
      if (coHost) {
        res.status(200);
        return res.json({ Attendees: finalAttendees });
      }
      const filteredAttendees = finalAttendees.filter(
        (attendee) => attendee.Attendance.status !== "pending"
      );
      res.status(200);
      return res.json({ Attendees: filteredAttendees });
    }
    res.status(200);
    return res.json({ Attendees: finalAttendees });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

// finished route
router.post("/:eventId/attendance", async (req, res) => {
    const { eventId } = req.params;
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
        const event = await Event.findByPk(eventId);

        if (!event) {
            const err = {};
            err.message = "Event couldn't be found";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }


        const membership = await Membership.findOne({
            where: {
                groupId: event.groupId,
                userId: userId,
            }
        });

        if (!membership) {
            const err = {};
            err.message = "Forbidden";
            err.statusCode = 403;
            res.status(403);
            return res.json(err);
        }

        const attendance = await Attendance.findOne({
            where: {
                eventId: eventId,
                userId: userId,
            }
        });

        if (attendance) {
            const err = {};
            err.message = "User is already an attendee of the event";
            err.statusCode = 400;
            res.status(400);
            return res.json(err);
        }

        const newAttendance = await Attendance.create({
            eventId: eventId,
            userId: userId,
            status: "pending",
        });

        res.status(200);
        return res.json({ userId: newAttendance.userId, status: newAttendance.status });
    } catch (err) {
        console.log(err);
        res.status(500);
        return res.json(err);
    }
});

// finished route
router.put("/:eventId/attendance", async (req, res) => {
    const { eventId } = req.params;
    const { user } = req;
    const userId = user.id;
    let { userId: attendanceUserId, status } = req.body;
    status = status.toLowerCase();

    if (!user) {
        const err = {};
        err.message = "Authentication required";
        err.statusCode = 401;
        res.status(401);
        return res.json(err);
    }

    if (status === "pending") {
        const err = {};
        err.message = "Cannot change an attendance status to pending";
        err.statusCode = 400;
        res.status(400);
        return res.json(err);
    }

    try {
        const event = await Event.findByPk(eventId);

        if (!event) {
            const err = {};
            err.message = "Event couldn't be found";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }

        const organizer = await Group.findOne({
            where: {
                organizerId: userId,
            }
        });

        const coHost = await Membership.findOne({
            where: {
                groupId: event.groupId,
                userId: userId,
                status: "co-host",
            }
        });

        if (!organizer || !coHost) {
            const err = {};
            err.message = "Forbidden";
            err.statusCode = 403;
            res.status(403);
            return res.json(err);
        }

        const attendance = await Attendance.findOne({
            where: {
                eventId: eventId,
                userId: attendanceUserId,
            }
        });

        if (!attendance) {
            const err = {};
            err.message = "Attendance between the user and the event does not exist";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }

        

        Attendance.update({ status }, {
            where: {
                eventId: eventId,
                userId: attendanceUserId,
            }
        });

        const finalAttendance = {
            id: attendance.id,
            userId: attendanceUserId,
            status: status,
        }

        res.status(200);
        return res.json(finalAttendance);
    } catch (err) {
        console.log(err);
        res.status(500);
        return res.json(err);
    }
});


// finished route
router.delete("/:eventId/attendance", async (req, res) => {
    const { eventId } = req.params;
    const { user } = req;
    const userId = user.id;
    const { userId: attendanceUserId } = req.body;
    
    if (!user) {
        const err = {};
        err.message = "Authentication required";
        err.statusCode = 401;
        res.status(401);
        return res.json(err);
    }

    try {
        const event = await Event.findByPk(eventId);
        
        if (!event) {
            const err = {};
            err.message = "Event couldn't be found";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }

        const organizer = await Group.findOne({
            where: {
                organizerId: userId,
            }
        });

        const coHost = await Membership.findOne({
            where: {
                groupId: event.groupId,
                userId: userId,
                status: "co-host",
            }
        });

        if (!organizer || !coHost) {
            const err = {};
            err.message = "Forbidden";
            err.statusCode = 403;
            res.status(403);
            return res.json(err);
        }

        const attendance = await Attendance.findOne({
            where: {
                eventId: eventId,
                userId: attendanceUserId,
            }
        });

        if (!attendance) {
            const err = {};
            err.message = "Attendance does not exist for this User";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }

        Attendance.destroy({
            where: {
                eventId: eventId,
                userId: attendanceUserId,
            }
        });

        res.status(200);
        return res.json({ message: "Successfully deleted attendance from event" });
    } catch (err) {
        console.log(err);
        res.status(500);
        return res.json(err);
    }
});


// finished route
router.delete("/:eventId", async (req, res) => {
    const { eventId } = req.params;
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
        const event = await Event.findByPk(eventId);

        if (!event) {
            const err = {};
            err.message = "Event couldn't be found";
            err.statusCode = 404;
            res.status(404);
            return res.json(err);
        }

        const organizer = await Group.findOne({
            where: {
                organizerId: userId,
            }
        });

        const coHost = await Membership.findOne({
            where: {
                groupId: event.groupId,
                userId: userId,
                status: "co-host",
            }
        });

        if (!organizer || !coHost) {
            const err = {};
            err.message = "Forbidden";
            err.statusCode = 403;
            res.status(403);
            return res.json(err);
        }

        Event.destroy({
            where: {
                id: eventId,
            }
        });

        res.status(200);
        return res.json({ message: "Successfully deleted" });
    } catch (err) {
        console.log(err);
        res.status(500);
        return res.json(err);
    }
});



module.exports = router;
