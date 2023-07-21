import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModal.js";
import { Movie } from "../model/movieModal.js";

export async function sign_Up(req, res) {
  const { userName, password, email } = req.body;

  try {
    const alreadyUser = await User.findOne({ email });

    if (alreadyUser) {
      return res.status(400).json({ msg: "This email is already being used" });
    } else {
      const hash = await bcrypt.hash(password, 12);
      //const user = await User.create({ email, userName, password: hash });
      const user = await new User({ email, userName, password: hash });
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.SECRET,
        { expiresIn: "3h" }
      );
      await user.save();

      if (user) {
        const { password, ...responseUser } = user._doc;
        return res.status(200).json({ token, user: responseUser });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: e.message });
  }
}

export async function log_In(req, res) {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "No users by that email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "The password does not match" });
    } else {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.SECRET,
        { expiresIn: "3h" }
      );

      if (user) {
        const { password, ...responseUser } = user._doc;
        return res.status(200).json({ token, user: responseUser });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: e.message });
  }
}

export async function google_Sign_In(req, res) {
  const { email, userName, sub } = req.body;

  try {
    let oldUser = await User.findOne({ email });

    if (oldUser) {
      // If theres already a user using the email we are going to check if it has a googleId. If it has a googleId we log in with that user.
      //* If the user doesnt have a googleId that means this user was created with mongodb and we will return user already using email
      if (oldUser.googleId) {
        const user = oldUser;
        return res.status(200).json({ token: sub, user });
      } else {
        return res
          .status(400)
          .json({ msg: "Sorry this email is already being used" });
      }
    }

    const user = await new User({ email, userName, googleId: sub });
    await user.save();
    res.status(200).json({ user, token: sub });
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: e.message });
  }
}

export async function like_Movie(req, res) {
  const { movieId, title, img, overview } = req.body;
  const userId = String(req.userId);

  try {
    if (!userId) {
      return res
        .status(404)
        .json({ msg: "You need to be logged in to an authroized user" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Cant find user" });
    }

    const index = user.savedMovie.findIndex((item) => item.movieId === movieId);

    if (index === -1) {
      user.savedMovie.push({...req.body});
    } else {
      user.savedMovie = user.savedMovie.filter(
        (item) => item.movieId !== movieId
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });

    res.status(200).json(updatedUser.savedMovie);
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: e.message });
  }

  
}

export async function get_Saved_Movies(req,res){
  const userId = String(req.userId);

  try{
    const user = await User.findById(userId)

    if(!user){
      return res.status(400).json({msg:"Theres no user by that id"})
    }

    res.status(200).json(user.savedMovie)
    

  }catch(e){
    console.log(e);
    res.status(404).json({ msg: e.message });
  }
}
 