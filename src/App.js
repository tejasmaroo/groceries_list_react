import { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Contents from './Contents';
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import ApiRequest from './ApiRequest';

function App() {
  const API_URL = 'http://localhost:3500/items';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems  = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('Did not receive expected data');
        const listItems = await response.json()
        setItems(listItems);
        setFetchError(null);
      } catch(err){
        setFetchError(err.message);
        setItems([]);
      }finally{
        setLoading(false);
      }
    }
    setTimeout(() => {
      fetchItems()
    }, 20)
  }, [])

  const addItem = async (item) => {
    const id = String(items.length ? Number(items[items.length - 1].id) + 1 : 1);
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
    const result = await ApiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  }

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id? {...item, checked: !item.checked}:item);
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',  
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })
    };
    const requrl = `${API_URL}/${id}`;
    console.log(requrl)
    const result = await ApiRequest(requrl, updateOptions);
    if(result) setFetchError(result)
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems)

    const deleteOptions = {
      method: 'DELETE'
    };
    const requrl = `${API_URL}/${id}`;
    console.log(requrl)
    const result = await ApiRequest(requrl, deleteOptions);
    if(result) setFetchError(result)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addItem(newItem)
    setNewItem('')
  } 
  return (
    <div className="App">
      <Header title='Groceries List' />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem 
        search={search}
        setSearch={setSearch}
      />  
      <main>
        {loading && <p>Loading Items...</p>}
        {fetchError && <p style={{color:'red'}}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !loading && <Contents 
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer length={items.length}/>
    </div>
  );
}

export default App;
