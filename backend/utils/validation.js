const { validationResult } = require("express-validator");
const { check } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

let date = new Date().toISOString();
let date2 = new Date().toISOString();
// Create a Event Validation Error Handling Middleware

const validateEvent = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists()
    .isInt({ min: 0 })
    .withMessage("Capacity must be an integer"),
  check("price").exists().isFloat({ min: 0 }).withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .isAfter(date)
    .withMessage("Start date must be in the future"),
  check("endDate")
    .exists({ checkFalsy: true })
    .isAfter(date2)
    .withMessage("End date is less than start date")
    .custom((val, { req }) => {
      start = new Date(req.body.startDate);
      end = new Date(val);
      if (start >= end) {
        throw new Error("End date is less than start date");
      } else {
        return true;
      }
    }),
  check("imageUrl")
    .exists({ checkFalsy: true })
    .optional({ checkFalsy: true })
    .custom((val) => {
      if (
        val.slice(val.length - 4, val.length) === ".jpg" ||
        val.slice(val.length - 5, val.length) === ".jpeg" ||
        val.slice(val.length - 4, val.length) === ".png"
      ) {
        return true;
      } else {
        throw new Error("Image URL must end in .png, .jpg, or .jpeg");
      }
    })
    .withMessage("Image URL must end in .png, .jpg, or .jpeg"),
  handleValidationErrors,
];

const validateSearch = [
  check("page")
    .isInt({ min: 1, max: 20 })
    .optional({ checkFalsy: true })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .isInt({ min: 1, max: 20 })
    .optional({ checkFalsy: true })
    .withMessage("Size must be greater than or equal to 1"),
  check("name")
    .isString()
    .optional({ checkFalsy: true })
    .withMessage("Name must be a string"),
  check("type")
    .isIn(["Online", "In person"])
    .optional({ checkFalsy: true })
    .withMessage("Type must be 'Online' or 'In person'"),
  check("startDate")
    .isISO8601()
    .optional({ checkFalsy: true })
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];

//Create a Group Validation Error Handling Middleware
const validateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private")
    .exists()
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("imageUrl")
    .exists({ checkFalsy: true })
    .optional({ checkFalsy: true })
    .custom((val) => {
      if (
        val.slice(val.length - 4, val.length) === ".jpg" ||
        val.slice(val.length - 4, val.length) === "jpeg" ||
        val.slice(val.length - 4, val.length) === ".png"
      ) {
        return true;
      } else {
        throw new Error("Image URL must end in .png, .jpg, or .jpeg");
      }
    })
    .withMessage("Image URL must end in .png, .jpg, or .jpeg"),
  handleValidationErrors,
];

//Handles validation errors that occur with the body of a request, attached to Sign up route
const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("Last Name is required"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

//Create a Venue Validation Error Handling Middleware
const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  handleValidationErrors,
];

//Looks for valid membership specs -- using with put route for change membership status
const validateMembership = [
  check("memberId").isInt().withMessage("memberId must be an integer"),
  check("status")
    .isIn(["pending", "member", "co-host", "organizer"])
    .withMessage("status must be 'pending', 'member', 'co-host', 'organizer'"),
  handleValidationErrors,
];
//Looks for valid attendance specs -- using with put route for change attendance status
const validateAttendance = [
  check("userId").isInt().withMessage("userId must be an integer"),
  check("status")
    .isIn(["pending", "waitlist", "attending"])
    .withMessage("status must be 'attending', 'waitlist', 'pending'"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateAttendance,
  validateEvent,
  validateGroup,
  validateMembership,
  validateVenue,
  validateSearch,
  validateSignup,
};
