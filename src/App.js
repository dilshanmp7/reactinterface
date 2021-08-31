import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppoinment";
import AppoinmentInfo from "./components/AppoinmentInfo";
import {useState, useEffect,useCallback} from 'react'

function App() {

  let [appointmentList,setAppointmentList] = useState([]);
  let [query,setQuery] = useState("");
  let [sortby,setSortby] = useState("petName");
  let [orderBy,setOrderby] = useState("asc");

  const filteredAppointments = appointmentList.filter(item=>
    {
      return(
        item.petName.toLowerCase().includes(query.toLowerCase())  ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }).sort((a, b) => {
      let order = (orderBy === 'asc') ? 1 : -1;
      return (
        a[sortby].toLowerCase() < b[sortby].toLowerCase()
          ? -1 * order : 1 * order
      )
    })

  const fetchData= useCallback(()=>{
    fetch('./data.json')
    .then(response=>response.json())
    .then(data=>{
      setAppointmentList(data)
    })
  },[])

  useEffect(()=>{
    fetchData();
  },[fetchData])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top" />
        Your Appointments
        </h1>
        <AddAppointment 
        onSendAppoinment={newApp=>setAppointmentList([...appointmentList,newApp])}
        lastId={appointmentList.reduce((max,item)=> Number(item.id) > max ? Number(item.id):max,0)}></AddAppointment>
        <Search query={query} 
                onQueryChange={ value=> setQuery(value)}
                orderBy={orderBy}
                onOrderByChange={ord=> setOrderby(ord)}
                sortby={sortby}
                onSortByChange={sort=> setSortby(sort)}
                />

        <ul className="divide-y divide-gray-200">
        {filteredAppointments
          .map(appointment => (
           <AppoinmentInfo key={appointment.id} appointment={appointment}
           onDeleteAppoinment={id=> setAppointmentList(appointmentList.filter(appointment=> appointment.id !== id ))
          }
           >
           </AppoinmentInfo>
          ))
        }
      </ul>

    </div>
  );
}

export default App;