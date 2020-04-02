import React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      searchResults: [],
      playlistName:"Default Playlist", 
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }
  addTrack(newTrack) {
    let tracks = this.state.playlistTracks
    if (tracks.find(savedTrack => savedTrack.id === newTrack.id)) {
      return;
    }
    tracks.push(newTrack)
    this.setState({playlistTracks: tracks})
  }
  removeTrack(removeTrack) {
    const tracks = this.state.playlistTracks.filter(track => track.id !== removeTrack.id)
    this.setState({playlistTracks: tracks})
  }
  updatePlaylistName(newPlaylistName) {
    this.setState({playlistName: newPlaylistName})
  }
  savePlaylist() {
    const trackUri = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackUri).then( () => { 
      this.setState({
        playlistName: 'New Playlist', 
        playlistTracks: [] }
        )})
  }
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist" >
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;