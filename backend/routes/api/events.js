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
const { Op } = require("sequelize");
const moment = require("moment");

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

  const group = await Group.findByPk(event.groupId);
  if (group.organizerId === id) {
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
    let { price } = req.body;
    let { venueId } = req.body;

   

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
        return true;
      }

      const numAfterDecimal = numArr.length - decimalIndex - 1;

      if (numAfterDecimal > 2) {
        return false;
      } else {
        price = priceFormatter.format(price);
        return true;
      }
    }

    if (!event) {
      const err = {};
      err.message = "Event couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    if (typeof venueId === "undefined") {
      err = {};
      err.message = "Venue cannot be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    console.log(typeof venueId)
    if (venueId === "" || typeof venueId !== "number") {
      err = {};
      err.message = "Venue has to be a number";
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

      

      const venue = await Venue.findByPk(venueId);
 

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
        const venue = await Venue.findByPk(venueId);

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
       
      if (priceChecker(price) === false) {
        price = priceFormatter.format(price);
      }

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
  let { page, size, name, type, startDate } = req.query;
  let pageInt = parseInt(page);
  let sizeInt = parseInt(size);
  let today = new Date();
  if (startDate) {
    startDate = new Date(startDate);
  }
  console.log("startDate", startDate);

  if (type) {
    type = type.toLowerCase();
  }

  if (startDate) {
    function isValidDate(startDate) {
      let date = new Date(startDate);
      if (isNaN(date.getTime())) {
        return false;
      }
      return true;
    }
  }

  let err = {
    errors: {},
  };

  if (!page) {
    pageInt = 1;
  }

  if (!size) {
    sizeInt = 20;
  }
  let offset = (pageInt - 1) * sizeInt;
  let where = {};

  if (
    pageInt < 1 ||
    pageInt > 10 ||
    sizeInt < 1 ||
    sizeInt > 20 ||
    (name && typeof name !== "string") ||
    (type && type !== "online" && type !== "in person") ||
    (startDate && !isValidDate(startDate))
  ) {
    if (pageInt < 1 || pageInt > 10) {
      statusCode = err.statusCode = 400;
      err.errors.page =
        "Page must be greater than or equal to 1 and less than or equal to 10";
    } else if (sizeInt < 1 || sizeInt > 20) {
      statusCode = err.statusCode = 400;
      err.errors.size =
        "Size must be greater than or equal to 1 and less than or equal to 20";
    } else if (name && typeof name !== "string") {
      statusCode = err.statusCode = 400;
      err.errors.name = "Name must be a string";
    } else if (type && type !== "online" && type !== "in person") {
      statusCode = err.statusCode = 400;
      err.errors.type = "Type must be 'Online' or 'In Person'";
    } else if (startDate && !isValidDate(startDate)) {
      statusCode = err.statusCode = 400;
      err.errors.startDate =
        "Start date must be a valid datetime and ISO-8601 standard date format. example date  '2021-11-21T01:00:00.000Z'";
    }
    return res.status(400).json(err);
  }

  if (name) {
    where.name = { [Op.like]: `%${name}%` };
  }

  if (type) {
    where.type = type;
    console.log(where.type);
  }

  if (startDate) {
    where.startDate = { [Op.gte]: startDate };
  }

  try {
    const events = await Event.findAll({
      where: where,
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
      offset,
      limit: sizeInt,
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

    const finalEvents = events.map((event) => {
      let eventNumAttending = numAttending.find(
        (num) => num.eventId === event.id
      );

      if (!eventNumAttending) {
        eventNumAttending = { numAttending: 0 };
      }

      if (numAttending.length !== 0) {
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
        description: event.description,
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
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Group,
          attributes: ["id", "organizerId", "name", "private", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state", "lat", "lng"],
        },
        {
          model: EventImage,
          attributes: ["id", "url"],
        }
      ],
    });


    const groupImages = await GroupImage.findAll({
      where: {
        groupId: event.Group.id,
      },
      attributes: ["id", "url"],
    });


     const groupOrganizerId = event.Group.organizerId;
     
      const groupOrganizer = await User.findByPk(groupOrganizerId, {
        attributes: ["id", "firstName", "lastName"],
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
      description: event.description,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: eventNumAttending.numAttending,
      Group: event.Group,
      GroupImages: groupImages,
      GroupOrganizer: groupOrganizer,
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

  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;

  

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

  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }

  const userId = user.id;

  

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
        status: "member",
      },
    });

    if (!membership) {
      const err = {};
      err.message = "Forbidden";
      err.statusCode = 403;
      res.status(403);
      return res.json(err);
    }

    const attendance = await Attendance.findOne({
      exclude: ["UserId", "EventId"],
      where: {
        eventId: eventId,
        userId,
      },
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
    return res.json({
      userId: newAttendance.userId,
      status: newAttendance.status,
    });
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
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;
  let { userId: attendanceUserId, status } = req.body;
  status = status.toLowerCase();

  

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
      },
    });

    const coHost = await Membership.findOne({
      where: {
        groupId: event.groupId,
        userId: userId,
        status: "co-host",
      },
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
      },
    });

    if (!attendance) {
      const err = {};
      err.message = "Attendance between the user and the event does not exist";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    Attendance.update(
      { status },
      {
        where: {
          eventId: eventId,
          userId: attendanceUserId,
        },
      }
    );

    const finalAttendance = {
      id: attendance.id,
      userId: attendanceUserId,
      status: status,
    };

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
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;
  const { userId: attendanceUserId } = req.body;

  

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
        id: event.groupId,
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

    if (!organizer) {
      if (coHost) {
        Attendance.destroy({
          where: {
            eventId: eventId,
            userId: attendanceUserId,
          },
        });
        res.status(200);
        return res.json({
          message: "Successfully deleted attendance from event",
        });
      }
      else if (userId === attendanceUserId) {
        Attendance.destroy({
          where: {
            eventId: eventId,
            userId: attendanceUserId,
          },
        });
        res.status(200);
        return res.json({
          message: "Successfully deleted attendance from event",
        });
      }
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
      },
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
      },
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
  if (!user) {
    const err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    res.status(401);
    return res.json(err);
  }
  const userId = user.id;

 

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      const err = {};
      err.message = "Event couldn't be found";
      err.statusCode = 404;
      res.status(404);
      return res.json(err);
    }

    const groupId = event.groupId;

    const group = await Group.findByPk(groupId);

    const organizer = group.organizerId;

    const coHost = await Membership.findOne({
      where: {
        groupId: event.groupId,
        userId: userId,
        status: "co-host",
      },
    });

    if (organizer !== userId) {
      if (coHost) {
        Event.destroy({
          where: {
            id: eventId,
          },
        });
        res.status(200);
        return res.json({ message: "Successfully deleted" });
      }
      const err = {};
      err.message = "Forbidden";
      err.statusCode = 403;
      res.status(403);
      return res.json(err);
    }

    if (organizer === userId) {
      Event.destroy({
        where: {
          id: eventId,
        },
      });
      res.status(200);
      return res.json({ message: "Successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json(err);
  }
});

module.exports = router;
