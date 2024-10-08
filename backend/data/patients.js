// TODO: Export and implement the following functions in ES6 format

import {patients} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const create = async (newUser
  ) => {
    let newUserToBeAdded = {
      email : newUser.email,
      username : newUser.username,
      password : newUser.password,
      gender : newUser.gender,
      contactNumber : newUser.contactNumber,
      password : newUser.password,
      dob : newUser.dob,
      doctorSpecialty : newUser.doctorSpecialty,
      doctorName: '', 
      message: ''
    };
  
    const patientsCollection = await patients();
    const insertInfo = await patientsCollection.insertOne(newUserToBeAdded);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw ('Error : patients not be added');
    const newId = insertInfo.insertedId.toString();
    const patientAdded = await get(newId);
    return patientAdded;
  };

  const findByEmail = async (email) => {
    try {
        const patientsCollection = await patients();
        const patient = await patientsCollection.findOne({ email });
        return patient;
    } catch (error) {
        throw new Error('Error fetching patient by email: ' + error.message);
    }
};

const updateByEmail = async (email, updatedData) => {
  const patientsCollection = await patients();
  const updatedPatient = await patientsCollection.findOneAndUpdate(
    { email: email },
    { $set: updatedData },
    { returnOriginal: false }
  );
  return updatedPatient.value;
};

  const get = async (id) => {
    const patientCollection = await patients();
    const patient = await patientCollection.findOne({_id: new ObjectId(id)});
    if (patient === null) throw ('Error : patient not found');
    patient._id = patient._id.toString();
    return patient;
  };

  const getPatient = async (id) => {
    const patientCollection = await patients();
    if(!(ObjectId.isValid(id))) throw('Error: invalid Object Id');
    const patient = await patientCollection.findOne({_id: new ObjectId(id)});
    if (patient === null) throw ('Error : patient not found');
    patient._id = patient._id.toString();
    return patient;
  };

// New method to find patient details by doctor's name
  const findByDoctorName = async (doctorName) => {
    try {
        const patientsCollection = await patients();
        const patientsList = await patientsCollection.find({ doctorName: doctorName }).toArray();
        return patientsList;
    } catch (error) {
        throw new Error('Error fetching patients by doctor name: ' + error.message);
    }
  };

  const exportMethods = {create, getPatient, findByEmail, get, updateByEmail, findByDoctorName}

  export default exportMethods;
