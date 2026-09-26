export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source]);

    if (error) {
      return res.status(400).json({
        sucsses:false,
        message: error.details[0].message,
      });
    }

    req[source] = value;

    next();
  };
};