import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [term, setTerm] = useState("");
  const [token, setToken] = useState("");

  // get access token for blizzard oauth system
  const getAccessToken = async () => {
    await axios
      .post(
        "https://us.battle.net/oauth/token?client_id=671a1880e85841e7aab1639773b1cbe5&client_secret=8KLwCy4b6UklRasHD4PTZih5k0jlLxGw&grant_type=client_credentials"
      )
      .then((res) => {
        setToken(res.data.access_token);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getAccessToken();
  }, []);

  // get all of the wow items based on search term
  const getItems = async () => {
    let arrOfItems = [];

    await axios
      .get(
        `https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&name.en_US=${term}&orderby=id&_page=1&access_token=${token}`
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
      return (
        items
          .flat()
          // .filter((x) => x.name.en_US === term)
          .map((item) => {
            return (
              <div key={item.data.id} style={{ border: "solid black 2px" }}>
                <div>{item.data.name.en_US}</div>
                <div>{item.data.quality.type}</div>
                <div>{item.data.item_subclass.name.en_US}</div>
              </div>
            );
          })
      );
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
