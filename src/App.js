import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({children, onClick}) {
  return (
    <button className="button" onClick={onClick}> {children}</button>
  )
}

export default function App() {
  
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showBillForm, setShowBillForm] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend(show => !showAddFriend);
  }

  function handleAddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handledSelectedFriend(friend) {
    setSelectedFriend(friend);
    setShowBillForm((show) => (selectedFriend?.id === friend.id) ? !showBillForm : true);
  }


  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList currentFriends={friends} onSelectFriend={handledSelectedFriend} showBillForm={showBillForm} selectedFriend={selectedFriend}/>

        { showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}> {showAddFriend ? 'Close' : 'Add New Friend'} </Button>
      </div>
      <div>
        {(selectedFriend !== null && showBillForm) && (<FormSplitBill selectedFriend={selectedFriend} />)}
      </div>
    </div>
  )
}

function FriendsList({currentFriends, onSelectFriend, showBillForm, selectedFriend}) {

  return (
    <ul>
      {
        currentFriends.map((friend) => <Friend key={friend.id} friend={friend} onSelectFriend={onSelectFriend} showBillForm={showBillForm} selectedFriend={selectedFriend}/>)
      }
    </ul>
  )
}

function Friend({friend, onSelectFriend, showBillForm, selectedFriend}) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      { friend.balance < 0 && <p className="red">You owe {friend.name } Php { Math.abs(friend.balance)} </p>}
      { friend.balance > 0 && <p className="green">{friend.name } owes you Php { Math.abs(friend.balance)} </p>}
      { friend.balance === 0 && <p>You and {friend.name } are even.</p>}
      
      <Button onClick={() => onSelectFriend(friend)}>{ (selectedFriend?.id === friend.id && showBillForm) ? 'Close' : 'Select'}</Button>

    </li>
  )
}

function FormAddFriend({onAddFriend}) {

  const [name, setName] = useState('');
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!name || !image) return

    const id = new Date().getTime();
    const newFriend = {
      id: id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48?u=499476');
  }
  
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🪶Friend Name</label>
      <input placeholder="Enter name here..." type="text" value={name} onChange={(e) => setName(e.target.value)}/>

      <label>🖼️Image URL</label>
      <input placeholder="Enter url here..." type="text" value={image} onChange={(e) => setImage(e.target.value)}/>

      <Button>Add</Button>

    </form>
  )
}

function FormSplitBill({selectedFriend}) {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💸 Bill value</label>
      <input type="text"/>

      <label>😭 Your expense</label>
      <input type="text"/>

      <label>😎 X's expense</label>
      <input type="text" disabled/>

      <label>🤔 Who is paying the bill?</label>

      <select>
        <option>You</option>
        <option>X</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}