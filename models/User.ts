import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    hidden: true,
  },
  phone: {
    type: String,
    minlength: 6,
    maxlength: 12,
  }
});

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        next();
    }
    console.log("User DB", this);

    try{
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        next();
    }catch{
        next(new Error('Error hashing password'));
    }
});
UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
}
UserSchema.statics.findByEmail = async function(email: string) {
  const usr = await models.User.findOne({email});
  if(!usr) throw new Error('User not found');
  return usr;
}

const User = models.User || model('User', UserSchema);


export default User;