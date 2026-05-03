import './App.css'
import Header from './Header';
import ListeLignes from './ListeLignes';
import Footer from './Footer';

function App(){
  const lignes = [
    {id: 1, numero: "1", depart: "Parcelles Assainies", arrivee: "Plateau", arrets: 14, couleur: "#0a6e31"},
    { id: 2, numero: "7", depart: "Guediawaye", arrivee: "Place Obe", arrets: 18, couleur: "#2c5f8a"},
    { id: 3, numero: "15", depart: "Pikine", arrivee: "Medina", arrets: 12, couleur: "#e8a020"},
    {id: 4, numero: "23", depart: "Ouakam", arrivee: "Grand Dakar", arrets: 10, couleur: "#1a312a"},
    {id: 5, numero: "8", depart: "Almadies", arrivee: "Colobane", arrets: 16, couleur: "#0a6e31"},
    { id: 6, numero: "12", depart: "Yoff", arrivee: "Sandaga", arrets: 11, couleur: "#e8a020"},
    { id: 7, numero: "2", depart: "Medina", arrivee: "Guediawaye", arrets: 13, couleur: "#e8a020"},
    { id: 8, numero: "33", depart: "Colobane", arrivee: "Grand Yoff", arrets: 11, couleur: "#0a6e31"},
    { id: 9, numero: "71", depart: "Fann", arrivee: "Keur Massar", arrets: 28, couleur: "#2c5f6a"},
    { id: 10, numero: "84", depart: "UCAD", arrivee: "Diakhaye", arrets: 34, couleur: "#e8a020"},
  ];

  return(
    <div className="App">
      <Header/>
      <main className="contenu">
        <ListeLignes lignes={lignes}/>
      </main>
      <Footer/>
    </div>
  );
}

export default App;