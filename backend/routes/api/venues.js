const express = require("express");
const router = express.Router();
const {
  Group,
  sequelize,
  Membership,
  GroupImage,
  User,
  Venue,
} = require("../../db/models");

router.put("/:venueId", async (req, res, next) => {
  const { user } = req;
  if (!user) {
    err = {};
    err.message = "Authentication required";
    err.statusCode = 401;
    return res.json(err);
  }
  try {
    const { venueId } = req.params;
    const venue = await Venue.findByPk(venueId);
    const { id } = req.user;

    if (!venue) {
      const err = {};
      err.message = "Venue couldn't be found";
      err.statusCode = 404;
      return res.json(err);
    }

    const group = await Group.findByPk(venue.groupId);

    if (group.organizerId === id) {
      const { address, city, state, zip, lat, lng } = req.body;
      const updatedVenue = await Venue.update(
        {
          address,
          city,
          state,
          lat,
          lng,
        },
        { where: { id: venueId }, returning: true }
      );

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
        } if (!city) {
          err.errors.city = "City is required";
          err.statusCode = statusCode;
        } if (!state) {
          err.errors.state = "State is required";
          err.statusCode = statusCode;
        } if (lat >= 90 || lat <= -90) {
          err.errors.lat = "Latitude is not valid";
          err.errors.statusCode = statusCode;
        } if (lng >= 180 || lng <= -180) {
          err.errors.lng = "Longitude is not valid";
          err.statusCode = statusCode;
        }
        return res.json(err);
      }

      const finalVenue = {
        id: venueId,
        groupId: group.id,
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
        where: { userId: id, groupId: group.id, status: "co-host" },
      });

      if (!membership) {
        const err = {};
        err.message = "Forbidden";
        err.statusCode = 403;
        return res.json(err);
      } else {
        const { address, city, state, zip, lat, lng } = req.body;
        const updatedVenue = await Venue.update(
          {
            address,
            city,
            state,
            lat,
            lng,
          },
          { where: { id: venueId }, returning: true }
        );

        const finalVenue = {
            id: venueId,
            groupId: group.id,
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
    return res.json({ message: "Internal Server Error", statusCode: 500 });
  }
});



module.exports = router;
