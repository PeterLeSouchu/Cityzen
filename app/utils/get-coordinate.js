async function getCoordinates(address){
  const response = await fetch(`${process.env.API_GEO_ADDRESS}${address}${process.env.API_GEO_ADDRESS_KEY}`);
  const coordinates = await response.json();

  return coordinates;
}

export default getCoordinates;