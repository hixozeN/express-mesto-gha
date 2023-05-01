/* eslint-disable import/no-extraneous-dependencies */
const { Schema, model } = require('mongoose');

const cardSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: 'user',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

module.exports = model('card', cardSchema);
