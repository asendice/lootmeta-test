import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [term, setTerm] = useState("");
  const [token, setToken] = useState("");
  const [media, setMedia] = useState([]);

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

  // getting item images
  const getItemImages = async (id) => {
    console.log("getItemImages, has been called ");
    let arr = [];
    if (id.length <= 1) {
      await axios
        .get(
          `https://us.api.blizzard.com/data/wow/media/item/${id[0]}?namespace=static-classic-us&locale=en_US&access_token=${token}
        `
        )
        .then((res) => {
          let obj = {
            image: res.data.assets[0].value,
            id: res.data.id,
          };
          arr.push(obj);
          setMedia(arr);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      for (let i = 0; i < id.length - 1; i++) {
        console.log("getItemImages for loop has been initiated");
        await axios
          .get(
            `https://us.api.blizzard.com/data/wow/media/item/${id[i]}?namespace=static-classic-us&locale=en_US&access_token=${token}
            `
          )
          .then((res) => {
            let obj = {
              image: res.data.assets[0].value,
              id: res.data.id,
            };
            arr.push(obj);
            setMedia(arr);
          })
          .catch((err) => {
            console.error(err);
          });
      }
      console.log(arr, "arr");
    }
  };
  const filteredItems = items.flat().filter((item) => {
    return item.data.name.en_US.toLowerCase().includes(term.toLowerCase());
  });

  // get all of the wow items based on search term
  const getItems = async () => {
    let arrOfItems = [];
    await axios
      .get(
        `https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&name.en_US=${term}&orderby=field1&_pageSize=1000&_maxPageSize=1000&access_token=${token}`
      )
      .then((res) => {
        arrOfItems.push(res.data.results);
        const ids = filteredItems.map((x) => {
          return x.data.id;
        });
        getItemImages(ids);
        setItems(arrOfItems);
      })

      .catch((err) => {
        console.error(err);
      });
  };

  const mergedArray = filteredItems.map((item, i) => {
    if (media.length > 0 && item.data.id === media[i].id) {
      return Object.assign({}, item, media[i]);
    }
  });
  console.log(media, "media");
  console.log(mergedArray, "mergedArray");

  const submitSearch = () => {
    getItems();
  };

  const renderNamesOfItems = () => {
    if (mergedArray.length > 0) {
      return mergedArray.map((item) => {
        return (
          <div>
            dsfj
            {/* <div key={item.data.id} style={{ border: "solid black 1px" }}>
              <img src={item.image} />

              <div>{item.data.name.en_US}</div>
              <div>{item.data.quality.type}</div>
              <div>{item.data.item_subclass.name.en_US}</div>
              <div>{item.data.id}</div>
            </div> */}
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
