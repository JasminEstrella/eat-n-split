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

  function handleShowAddFriend() {
    setShowAddFriend(show => !showAddFriend);
  }

  function handleAddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handledSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id) ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => 
      friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value} : friend
    ));
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList currentFriends={friends} onSelectFriend={handledSelectedFriend} selectedFriend={selectedFriend}/>

        { showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}> {showAddFriend ? 'Close' : 'Add New Friend'} </Button>
      </div>
      <div>
        {(selectedFriend) && (<FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />)}
      </div>
    </div>
  )
}

function FriendsList({currentFriends, onSelectFriend, selectedFriend}) {

  return (
    <ul>
      {
        currentFriends.map((friend) => <Friend key={friend.id} friend={friend} onSelectFriend={onSelectFriend} selectedFriend={selectedFriend}/>)
      }
    </ul>
  )
}

function Friend({friend, onSelectFriend, selectedFriend}) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={ isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      { friend.balance < 0 && <p className="red">You owe {friend.name } Php { Math.abs(friend.balance)} </p>}
      { friend.balance > 0 && <p className="green">{friend.name } owes you Php { Math.abs(friend.balance)} </p>}
      { friend.balance === 0 && <p>You and {friend.name } are even.</p>}
      
      <Button onClick={() => onSelectFriend(friend)}>{ (isSelected) ? 'Close' : 'Select'}</Button>

    </li>
  )
}

function FormAddFriend({onAddFriend}) {

  const [name, setName] = useState('');
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!name || !image) return;

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

function FormSplitBill({selectedFriend, onSplitBill}) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if(!bill || (!paidByUser && paidByUser !== 0)) return;  // allow 0 for user expenses
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💸 Bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} min="0"/>

      <label>😭 Your expense</label>
      <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} min="0"/>

      <label>😎 {selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled/>

      <label>🤔 Who is paying the bill?</label>

      <select value={whoIsPaying} onChange={(e) => setwhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}