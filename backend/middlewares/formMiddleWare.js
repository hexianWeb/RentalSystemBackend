import express from "express";

import formidable from "formidable";

const formMiddleWare = (req, res, next) => {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    req.files = files;
    req.fields = fields;
    next();
  });
};

export default formMiddleWare;
