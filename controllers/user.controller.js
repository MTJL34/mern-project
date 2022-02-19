const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID invalid : " + req.params.id);
  
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            bio: req.body.bio,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
      res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await UserModel.remove({ _id: req.params.id }).exec();
      res.status(200).json({ message: "Successfully deleted. " });
    } catch (err) {
      res.status(500).json({ message: err });
    }
};

module.exports.follow = async (req, res) => {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToFollow)
      )
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      //add to the follower list
      await UserModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: {following: req.body.idToFollow}},
        {new:true, upsert: true},
      )    
        .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).send({ message: err }));
          
      //add to the following list
      await UserModel.findByIdAndUpdate(
          req.body.isToFollow,
          { $addToSet: {followers: req.body.idToFollow}},
          {new:true, upsert: true},
      )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(400).send({ message: err }));

    } catch (err) {
      return res.status(500).json({ message: err });
    }
};

/* module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}; */

//l'erreure que j'ai :

/* [nodemon] restarting due to changes...
[nodemon] starting `node server.js`
C:\wamp64\www\MERN-PROJECT\node_modules\express\lib\router\route.js:202
        throw new Error(msg);
        ^

Error: Route.patch() requires a callback function but got a [object Undefined]
    at Route.<computed> [as patch] (C:\wamp64\www\MERN-PROJECT\node_modules\express\lib\router\route.js:202:15)
    at Function.proto.<computed> [as patch] (C:\wamp64\www\MERN-PROJECT\node_modules\express\lib\router\index.js:516:19)
    at Object.<anonymous> (C:\wamp64\www\MERN-PROJECT\routes\user.routes.js:15:8)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (C:\wamp64\www\MERN-PROJECT\server.js:3:20)
[nodemon] app crashed - waiting for file changes before starting...
 */