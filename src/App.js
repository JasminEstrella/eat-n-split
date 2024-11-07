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

  function handleShowAddFriend() {
    setShowAddFriend(show => !showAddFriend);
  }

  function handleAddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList currentFriends={friends} />

        { showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}> {showAddFriend ? 'Close' : 'Add New Friend'} </Button>
      </div>
      <div>
        <FormSplitBill />
      </div>
    </div>
  )
}

function FriendsList({currentFriends}) {

  return (
    <ul>
      {
        currentFriends.map((friend) => <Friend key={friend.id} friend={friend} />)
      }
    </ul>
  )
}

function Friend({friend}) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      { friend.balance < 0 && <p className="red">You owe {friend.name } Php { Math.abs(friend.balance)} </p>}
      { friend.balance > 0 && <p className="green">{friend.name } owes you Php { Math.abs(friend.balance)} </p>}
      { friend.balance === 0 && <p>You and {friend.name } are even.</p>}
      
      <Button>Select</Button>

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

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with friend.name</h2>

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