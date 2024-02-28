import { useState } from 'react';
import "./CRUD.css";



function Crud() {
    const [contacts, setContacts] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formState, setFormState] = useState({ name: '', phoneNumber: '' });
    const [editFormState, setEditFormState] = useState({ name: '', phoneNumber: '' });
  
    function setInput(key, value) {
      setFormState({ ...formState, [key]: value });
    }
  
    function setEditInput(key, value) {
      setEditFormState({ ...editFormState, [key]: value });
    }
  
    function addContact() {
      if (!formState.name || !formState.phoneNumber) return;
      setContacts([...contacts, formState]);
      setFormState({ name: '', phoneNumber: '' });
    }
  
    function deleteContact(index) {
      setContacts(contacts.filter((_contact, contactIndex) => contactIndex !== index));
    }
  
    function editContact(index) {
      setEditingIndex(index);
      setEditFormState(contacts[index]);
    }
  
    function saveEdit(index) {
      const updatedContacts = [...contacts];
      updatedContacts[index] = editFormState;
      setContacts(updatedContacts);
      setEditingIndex(null);
      setEditFormState({ name: '', phoneNumber: '' });
    }
  
    return (
      <div style={{    
        display: 'inline-block',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '45em',
        marginTop: '5em',
        }}>
        <input
          onChange={event => setInput('name', event.target.value)}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={event => setInput('phoneNumber', event.target.value)}
          value={formState.phoneNumber}
          placeholder="Phone Number"
        />
        <button style={{ backgroundColor:'green'}} onClick={addContact}>Save</button>
        {contacts.map((contact, index) => (
        <div key={contact.id}>
            {editingIndex === index ? (
              <>
                <input
                  onChange={event => setEditInput('name', event.target.value)}
                  value={editFormState.name}
                />
                <input
                  onChange={event => setEditInput('phoneNumber', event.target.value)}
                  value={editFormState.phoneNumber}
                />
                <button style={{ backgroundColor:'yellow'}} onClick={() => saveEdit(index)}>Save Edit</button>
              </>
            ) : (
              <>
                <h2>Name: {contact.name} <br/> Phone Number: {contact.phoneNumber}</h2>
                <button style={{ backgroundColor:'red'}} onClick={() => deleteContact(index)}>Delete</button>
                <button style={{ backgroundColor:'purple'}} onClick={() => editContact(index)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }
  

export default Crud;