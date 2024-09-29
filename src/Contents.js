import React from 'react'
import ItemList from './ItemList'

const Contents = ( {items, handleCheck, handleDelete} ) => {

  return (
    <main>
      {items.length ? 
      (
        <ItemList 
          items={items} 
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
      ) : (
            <p>This list is empty</p>
          )}
    </main>
  )
}

export default Contents
