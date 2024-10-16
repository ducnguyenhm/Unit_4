import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);  
  const [banList, setBanList] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [history, setHistory] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "live_llATQKNUEMFL9xylrS712Py9x40NTjl5hLjz8I7h476TsBaouaajgqvBqwtTaomr"
  });
  
  var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  const fetchData = async () => {
    setIsLoading(true);  
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&page=0&limit=1", requestOptions); 
      const result = await response.json();
      let randomCat = result[Math.floor(Math.random() * result.length)];
      
      while(banList.some((banned) => [randomCat.breeds[0].name, randomCat.breeds[0].origin, randomCat.breeds[0].life_span].includes(banned))) 
      {
        randomCat = result[Math.floor(Math.random() * result.length)];
        await delay(1000);
      }

      setData(randomCat);
      setHistory((prevHistory) => [...prevHistory, randomCat]); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBan = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  const handleUnban = (attribute) => {
    setBanList(banList.filter((item) => item !== attribute));
  };

  const nextItem = () => {
    fetchData();
  };

  return (
    <div>
      <h1>Cat Species</h1>
      {isLoading ? (
        <p>Loading...</p> 
      ) : (
        data && ( 
          <div className='cat-info'>
            <h2 onClick={() => handleBan(data.breeds[0].name)}>{data.breeds[0].name}</h2>
            <p onClick={() => handleBan(data.breeds[0].origin)}>Origin Country: {data.breeds[0].origin}</p> 
            <p onClick={() => handleBan(data.breeds[0].life_span)}>Life Span: {data.breeds[0].life_span}</p> 
            {data.url && <img src={data.url} alt={data.breeds[0].name} />}
            <button onClick={nextItem}>Discover More</button>
          </div>
          
        )
      )}
     
     <div className="ban-list">
        <h3 className="ban-list-title">Ban List</h3>
        <ul>
          {banList.map((attribute, index) => (
            <li key={index} onClick={() => handleUnban(attribute)}>
              {attribute}
            </li>
          ))}
        </ul>
      </div>

      <div className="history-list">
        <h3 className="history-list-title">Viewed Items History</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.breeds[0].name} - {item.breeds[0].origin} - {item.breeds[0].life_span}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
