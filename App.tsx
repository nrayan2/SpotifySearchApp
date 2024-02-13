import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

const CLIENT_ID = "73d82854a99045dbb2ab2f4c5be3efb9";
const CLIENT_SECRET = "062731c65da647aa8a8ba7ef28d4f3d9";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accesstoken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    //API Access Token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // Search
  async function search() {
    console.log("Searching for " + searchInput); // artist name

    // Get request using seach to get Artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accesstoken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
        setAlbums(data.items);
      });

    console.log("Artist ID is " + artistID);
    // Get request with Artist ID grab all the albums
    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });
    // Display albums to user
  }

  console.log(albums);
  return (
    <>
      <div className="App">
        <Container>
          <InputGroup className="mb-3" size="lg">
            <FormControl
              placeholder="Search For Artist"
              type="input"
              onKeyPress={(event) => {
                if (event.key == "Enter") {
                  search();
                }
              }}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button onClick={search}>Search</Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className="mx-4 row row-cols-4">
            {albums.map((album) => {
              console.log(album);
              return (
                <Card>
                  <Card.Img src={album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                    <Card.Title>{album.release_date}</Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
