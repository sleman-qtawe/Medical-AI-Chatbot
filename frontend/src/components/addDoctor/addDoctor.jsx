import { useState } from "react";
import './addDoctor.css'

export default function AddDoctor(){
  const [doctor,setDoctor] = useState({id : '',name : '',email : '',sspeciality : ''});

  const handleSubmit = (event)=> {
    event.preventDefault()
  }
  
  return(
    <div className="whole-page">
    <div className="add-doctors-page">
      <h1>Add New Doctor</h1>
      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="form-group">
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={doctor.id}
            onChange={(event)=> setDoctor({...doctor , id : event.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={doctor.name}
            onChange={(event)=> setDoctor({...doctor , name : event.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={doctor.email}
            onChange={(event)=> setDoctor({...doctor , email : event.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="speciality">Speciality:</label>
          <input
            type="text"
            id="speciality"
            name="speciality"
            value={doctor.speciality}
            onChange={(event)=> setDoctor({...doctor , speciality : event.target.value})}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Doctor
        </button>
      </form>
    </div>
    </div>
  );
}