async function getCoordinates(address){
  const response = await fetch(`${API_GEO_ADDRESS}${address}${API_GEO_ADDRESS_KEY}`);
  const coordinates = await response.json();

  return coordinates;
}

export default getCoordinates;