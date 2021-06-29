import React, { useEffect, useState } from "react";
import axios from "axios";

//access token: USLkLUzmuKtQ8jto5E9v6tTokDVSLWK7cc

const App = () => {
  const [items, setItems] = useState([]);
  const [term, setTerm] = useState("");

  // get all of the wow items - literally all of them
  const getItems = async () => {
    let arrOfItems = [];

    await axios
      .get(
        `https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&name.en_US=${term}&orderby=id&_page=1&access_token=USLkLUzmuKtQ8jto5E9v6tTokDVSLWK7cc`
      )
      .then((res) => {
        arrOfItems.push(res.data.results);
      })
      .catch((err) => {
        console.error(err);
      });
    setItems(arrOfItems);
  };

  // getting item images
  // const getItemImages = async () => {
  //   let arrOfItems = [];
  //   const itemIds = items.map((item) => {
  //     return item.data.id;
  //   });
  //   console.log(itemIds, "itemIds");
  //   for (let i = 0; i < itemIds.length - 1; i++) {
  //     await axios
  //       .get(
  //         `https://us.api.blizzard.com/data/wow/media/item/${itemIds[i]}?namespace=static-classic-us&locale=en_US&access_token=USLkLUzmuKtQ8jto5E9v6tTokDVSLWK7cc`
  //       )
  //       .then((res) => {
  //         arrOfItems.push(res.data.results);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  //   setItemMedia(arrOfItems.flat());
  // };

  const submitSearch = () => {
    getItems();
  };

  console.log(items);

  const renderNamesOfItems = () => {
    if (items.length > 0) {
      return items.flat().map((item) => {
        return (
          <div key={item.data.id} style={{ border: "solid black 2px" }}>
            <div>{item.data.name.en_US}</div>
            <div>{item.data.quality.type}</div>
            <div>{item.data.item_subclass.name.en_US}</div>
          </div>
        );
      });
    }
  };

  return (
    <div>
      <input onChange={(e) => setTerm(e.target.value)} />
      <button onClick={() => submitSearch()}>SUBMIT</button>
      {renderNamesOfItems()}
    </div>
  );
};

export default App;
