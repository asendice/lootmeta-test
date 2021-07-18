import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [term, setTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const [token, setToken] = useState("");
  const [media, setMedia] = useState([]);

  console.log(items, "items");

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
  const getMedia = async (id) => {
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
    }
  };
  const filteredItems = items.flat().filter((item) => {
    return item.data.name.en_US
      .toLowerCase()
      .includes(submittedTerm.toLowerCase());
  });

  // get all of the wow items based on search term
  const getItems = async () => {
    let arrOfItems = [];
    await axios
      .get(
        `https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&name.en_US=${submittedTerm}&orderby=field1&_pageSize=1000&_maxPageSize=1000&access_token=${token}`
      )
      .then((res) => {
        arrOfItems.push(res.data.results);
        setItems(arrOfItems);
      })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(filteredItems, "filteredItems");
  console.log(media, "media");

  const mergedArray = filteredItems.map((item, i) => {
    if (media.length > 0) {
      return Object.assign({}, item, media[i]);
    }
  });

  const submitSearch = () => {
    getItems();
    setSubmittedTerm(term);
  };

  useEffect(() => {
    console.log("useEffect de")
    if (filteredItems.length > 0 && media.length < 1) {
      const idsArr = filteredItems.map((item) => {
        console.log(item, "item in map func");
        return item.data.media.id;
      });
      getMedia(idsArr);
    }
  }, [submittedTerm]);

  if (filteredItems.length > 0 ljhfwef) {
    const idsArr = filteredItems.map((item) => {
      console.log(item, "item in map func");
      return item.data.media.id;
    });
    getMedia(idsArr);
  }

  const renderNamesOfItems = () => {
    if (media.length > 0) {
      return mergedArray.map((item) => {
        return (
          <div key={item.data.id}>
            <div style={{ border: "solid black 1px" }}>
              <img src={item.image} />
              <div>{item.data.name.en_US}</div>
              <div>{item.data.quality.type}</div>
              <div>{item.data.item_subclass.name.en_US}</div>
              <div>{item.data.id}</div>
            </div>
          </div>
        );
      });
    } else {
      <div>No results</div>;
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
