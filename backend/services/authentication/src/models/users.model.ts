import { Document, Schema, model } from "mongoose";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  roles: Array<string>;
  _createdDate: String;
  _updatedDate: String;
}

interface IUserDocument extends IUser {
  mathPassword: (pass: string) => Promise<boolean>;
}

const collection = "Users";

const userSchema = new Schema<IUserDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, default: [] }],
    _createdDate: { type: Date, default: Date.now() },
    _updatedDate: { type: Date },
  },
  {
    collection,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.mathPassword = async function (enteredPassword: string) {
  return Bun.password.verifySync(enteredPassword, this.password);
};

// Hash password with Bun
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // use bcrypt
  this.password = await Bun.password.hash(this.password, {
    algorithm: "bcrypt",
    cost: 10,
  });
});

const Users = model(collection, userSchema);

export { Users, IUser };
