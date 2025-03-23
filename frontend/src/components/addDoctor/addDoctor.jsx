import { useState } from "react";
import './addDoctor.css'

export default function AddDoctor(){
  const [doctor,setDoctor] = useState({id : 0,name : '',email : '',sspeciality : ''});
  const [doctors,setDoctors] = useState([]);

  //get all doctors
  useEffect(()=> {
    fetch('http://127.0.0.1:5000/get_doctors')
    .then((res) => res.json())
    .then((data) => {setDoctors(data)
      console.log(data)
    })
    .catch((error) => {
      console.log("Error", error);
    });
  },[doctor]);


  const handleSubmit = async(event)=> {
    event.preventDefault()
    var i = document.querySelectorAll('input#id')[0];
    var n = document.querySelectorAll('input#name')[0];
    var p = document.querySelectorAll('input#email')[0];
    var q = document.querySelectorAll('input#speciality')[0];
    p = {'id' : parseInt(i.value),'name' : n.value,'email' : p.value,'speciality' : q.value}

    try {
      // Send the new product to the backend
      const response = await fetch('http://127.0.0.1:5000/add_doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(p),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
  
      // If successful, update the local state (if needed)
      const addedDoctor = await response.json();

      setDoctor(p)
      
      console.log(addedDoctor)
      setDoctors([...doctors, addedDoctor]);
  
      // Clear the form inputs
      i.value = "";
      p.value = "";
      q.value = "";
      n.value = "";
  
    } catch (error) {
    console.error("Error adding doctor:", error);
  }
  };
  
  return(
    <div className="whole-page">
      {/* <div>{doctors?.map((doctor,i) => <div key={i}>{doctor.id} {doctor.name} {doctor.email} {doctor.speciality}</div>)}</div> */}
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