import logo from './newHutao8.png';
import './App.css';
import Pokedex from 'pokedex-promise-v2';
import { Fragment, useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Drawer, List, ListItem, ListItemText, Menu, TextField, Box } from '@mui/material';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const [pokemon, setPokemon] = useState('')
  const [chosenPokemon, setChosenPokemon] = useState(null)
  const [pokeSprites, setPokeSprites] = useState({})
  const [index, setIndex] = useState(0);
  const [spritesArray, setSpritesArray] = useState([]);
  const [showGames, setShowGames] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [invalidPokemon, setInvalidPokemon] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    createSpritesArray()
  }, [pokeSprites])

  useEffect(() => {
    setIsFavorited(favorites.some(pokemon => pokemon.name === chosenPokemon.name));
    console.log('favs', favorites)
  }, [favorites, chosenPokemon]);

  useEffect(() => {
    console.log('pic', spritesArray[index])
  }, [index])

  const flattenSprites = (sprites) => {
    let result = [];
    for (let key in sprites) {
      if (typeof sprites[key] === 'string') {
        result.push(sprites[key]);
      } else if (typeof sprites[key] === 'object') {
        result = result.concat(flattenSprites(sprites[key]));
      }
    }
    return result;
  };

  const P = new Pokedex();
  const getPokemonData = async (pokemon) => {
    console.log('pokemon', pokemon)
    setInvalidPokemon(false)
    try {
      P.getPokemonByName(pokemon)
        .then((res) => {
          console.log('pokemon info', res)
          setChosenPokemon(res);
          setSpritesArray(flattenSprites(res.sprites)); // Flatten sprites object into array
        })
        .catch((err) => {
          console.log('pokemon doesnt exist');
          setInvalidPokemon(true)
          setChosenPokemon(null);
        });
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  const createSpritesArray = async () => {
    let sprites = Object.entries(pokeSprites).map(([k, v]) => ({ v }))
    console.log('spritesaaa', sprites)
    setSpritesArray(sprites)
  }

  const cycleSpritesNext = () => {
    setIndex((index + 1) % spritesArray.length);
  };

  const cycleSpritesPrev = () => {
    setIndex((index - 1 + spritesArray.length) % spritesArray.length);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (!isFavorited) {
      setFavorites([...favorites, chosenPokemon]);
    } else {
      setFavorites(favorites.filter(pokemon => pokemon.name !== chosenPokemon.name));
    }
  };

  const handlePokemonData = (pokemonName) => {
    getPokemonData(pokemonName);
    setPokemon('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <MenuIcon onClick={() => setIsNavOpen(true)} style={{ position: 'absolute', top: 30, right: 30 }}>
          <Menu />
        </MenuIcon>

        <Drawer className="sidebar" anchor="right" open={isNavOpen} onClose={() => setIsNavOpen(false)}>
          <Typography variant="h5">Favs</Typography>
          <List style={{ backgroundColor: '#ddd' }}>
            {favorites.map((poke, index) => (
              <ListItem button key={index} onClick={() => { getPokemonData(poke.name); setIsNavOpen(false); }}>
                <ListItemText primary={poke.name} />
                <img src={poke.sprites.front_default} alt="pokemon" />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <img src={logo} className="App-logo" alt="logo" />
        <div className="pokeStuff">
          <h1>Search a Pokemon to see information about them.</h1>
          <TextField
            type="text"
            value={pokemon}
            onChange={(e) => setPokemon(e.target.value)}
            variant="outlined"
            style={{ marginBottom: '20px', backgroundColor: 'rgb(213 213 213)', marginRight: '20px' }}
          /><br />
          <Button
            id="pokemonButton"
            onClick={() => handlePokemonData(pokemon.toLowerCase())}
            variant="contained"
            style={{ backgroundColor: '#3f51b5', color: '#fff' }}
          >
            Submit
          </Button>

          {invalidPokemon ? <p style={{ color: 'red' }}>Please enter a valid pokemon.</p> : null}

          {chosenPokemon ?
            <div className="pokemonInformation">
              <p className="pokemonName">
                {chosenPokemon.name.charAt(0).toUpperCase()}{chosenPokemon.name.slice(1)}
                <IconButton onClick={toggleFavorite}>
                  {isFavorited ? <Star /> : <StarBorder />}
                </IconButton>
              </p>
              <div className="pokemonSprite">
                <button className="arrowButton" onClick={cycleSpritesPrev}> &#8592; </button>
                <img className="pokePic" src={spritesArray[index]} alt="pokemon" />
                <button className="arrowButton" onClick={cycleSpritesNext}> &#8594; </button>
              </div>
              <div className="pokemonStats">
                <p className="pokeStats">Height: {chosenPokemon.height}</p>
                <p className="pokeStats">Weight: {chosenPokemon.weight}</p>
                <p className="pokeStats">Base Experience: {chosenPokemon.base_experience}</p>
                <p className="pokeStats">Abilities: {chosenPokemon.abilities.map((ability) => ability.ability.name).join(', ')}</p>
                <p className="pokeStats">Types: {chosenPokemon.types.map((type) => type.type.name).join(', ')}</p>
              </div>
              <div>
                {showMoves ? <Button variant="contained" style={{ backgroundColor: '#3f51b5', color: '#fff' }} onClick={() => setCurrentMoveIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : chosenPokemon.moves.length - 1)}> &#8592; </Button> : null}
                <Button variant="contained" style={{ backgroundColor: '#3f51b5', color: '#fff' }} onClick={() => setShowMoves(!showMoves)}>Moves</Button>
                {showMoves ? <Button variant="contained" style={{ backgroundColor: '#3f51b5', color: '#fff' }} onClick={() => setCurrentMoveIndex(prevIndex => prevIndex < chosenPokemon.moves.length - 1 ? prevIndex + 1 : 0)}> &#8594; </Button> : null}
              </div>
              {showMoves && (
                <>
                  <Typography style={{ marginBottom: isMobile ? '20px' : '40px', marginTop: isMobile ? '20px' : '40px' }} variant="h4">
                    {chosenPokemon.moves[currentMoveIndex].move.name.charAt(0).toUpperCase() + chosenPokemon.moves[currentMoveIndex].move.name.slice(1)}
                  </Typography>
                  <TableContainer component={Paper} style={{ backgroundColor: '#f5f5f5', marginBottom: isMobile ? '20px' : '40px' }}>
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                      <Table className="pokemonMoves" style={{ minWidth: '100%' }}>
                        <TableHead>
                          <TableRow style={{ backgroundColor: '#3f51b5' }}>
                            <TableCell style={{ color: '#fff' }}>
                              <Box style={{ overflowX: 'auto', maxWidth: isMobile ? '100px' : 'auto' }}>Game</Box>
                            </TableCell>
                            <TableCell style={{ color: '#fff' }}>
                              <Box style={{ overflowX: 'auto', maxWidth: isMobile ? '100px' : 'auto' }}>Level</Box>
                            </TableCell>
                            <TableCell style={{ color: '#fff' }}>
                              <Box style={{ overflowX: 'auto', maxWidth: isMobile ? '100px' : 'auto' }}>Method</Box>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {chosenPokemon.moves[currentMoveIndex].version_group_details.map((detail, index) => (
                            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#fff' }}>
                            <TableCell style={{ width: '10%' }}>
                              <Box style={{ overflowX: 'auto', width: '100%' }}>{detail.version_group.name}</Box>
                            </TableCell>
                            <TableCell>
                              <Box style={{ overflowX: 'auto', width: '100%' }}>{detail.level_learned_at}</Box>
                            </TableCell>
                            <TableCell>
                              <Box style={{ overflowX: 'auto', width: '100%' }}>{detail.move_learn_method.name.charAt(0).toUpperCase() + detail.move_learn_method.name.slice(1)}</Box>
                            </TableCell>
                          </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableContainer>
                </>
              )}
            </div>
            : null}
        </div>
      </header>
    </div>
  );
}

export default App;
