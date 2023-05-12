import mongoose from "mongoose";

const movieSchema = mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    overview: {
      type: String,
      required: true,
    },
    liker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const Movie = mongoose.model("movie", movieSchema);
