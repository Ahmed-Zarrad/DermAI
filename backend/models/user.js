const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: String,
    role: {
        type: String,
        required: true,
        enum: ['admin', 'patient', 'doctor']
    },
    sendMessages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    recivedMessages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    birthday: Date,
    phone: {
        type: Number,
        length: 8,
    },
    country: String,
    city: String,
    address: String,
    postalCode: {
        type: Number,
        length: 4,
    },
    speciality: {
        type: String,
        enum: ['Acupuncture', 'Allergist', 'Anesthesiologist', 'Angiologist',
            'Audiologist', 'Cardiologist', 'Cardiovascular Surgeon', 'Dentist',
            'Dermatologist', 'Diabetes Specialist', 'Dietitian', 'Endocrinologist',
            'Family Physician', 'Gastroenterologist', 'General Surgeon', 'Geriatrician',
            'Gynecologist', 'Hematologist', 'Intensive Care Physician',
            'Internal Medicine Physician', 'Laboratory Medical Biologist',
            'Maxillofacial and Aesthetic Surgeon', 'Maxillofacial Surgeon and Stomatologist',
            'Medical Biologist', 'Nephrologist', 'Neurologist', 'Neurophysiologist',
            'Neurosurgeon', 'Nuclear Medicine Physician', 'Nutritionist', 'Obesity Surgeon',
            'Occupational Medicine Physician', 'Oncologist', 'Ophthalmologist', 'Orthodontist',
            'Orthopedic Pediatric Surgeon', 'Orthopedic Surgeon', 'Orthopedic Traumatologist',
            'Orthopedist', 'Orthoprothetist', 'Orthoptist', 'Osteopath',
            'Otolaryngologist (ENT Specialist)', 'Pediatric Surgeon', 'Pediatrician',
            'Pedopsychiatrist', 'Periodontist Implantologist',
            'Physical Medicine and Rehabilitation Physician', 'Physical Therapist', 'Physiologist',
            'Phytotherapist', 'Podiatrist', 'Prosthodontist', 'Psychotherapist', 'Radiologist',
            'Radiotherapist', 'Rheumatologist', 'Sexologist', 'Urologist', 'Urologist Surgeon', 'Urodynamician']
    },
    photo: {
        type: String,
    },
    publicId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
    delete returnedObject.publicId;
    delete returnedObject.created;
  },
});


userSchema.pre("remove", async function (next) {

    await Message.deleteMany({ user: this._id });
    next();
});
userSchema.pre("remove", async function (next) {

    await Message.deleteMany({ user: this._id });
    next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
