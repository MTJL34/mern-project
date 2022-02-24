const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");
const pipeline = promisify(require("stream").pipeline);

module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );
};

/* node:internal/errors:464
    ErrorCaptureStackTrace(err);
    ^

TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received null
    at TempWriteStream.WriteStream (node:internal/fs/streams:325:5)
    at new TempWriteStream (C:\wamp64\www\MERN-PROJECT\node_modules\fs-temp\lib\write-stream.js:6:15)
    at Object.createWriteStream (C:\wamp64\www\MERN-PROJECT\node_modules\fs-temp\lib\temp.js:121:10)
    at Busboy.<anonymous> (C:\wamp64\www\MERN-PROJECT\node_modules\multer\lib\read-body.js:70:27)
    at Busboy.emit (node:events:390:28)
    at Busboy.emit (C:\wamp64\www\MERN-PROJECT\node_modules\busboy\lib\main.js:37:33)
    at PartStream.<anonymous> (C:\wamp64\www\MERN-PROJECT\node_modules\busboy\lib\types\multipart.js:214:13)
    at PartStream.emit (node:events:390:28)
    at HeaderParser.<anonymous> (C:\wamp64\www\MERN-PROJECT\node_modules\dicer\lib\Dicer.js:50:16)
    at HeaderParser.emit (node:events:390:28) {
  code: 'ERR_INVALID_ARG_TYPE'
}
[nodemon] app crashed - waiting for file changes before starting... */