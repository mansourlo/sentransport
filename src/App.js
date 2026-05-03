import './App.css'
import Header from './Header';
import Footer from './Footer';
import Statistique from './Statistique';
import Statistique1 from './Statistique1';
import Statistique2 from './Statistique2';

function App(){
  return(
    <div className="App">
      <Header/>
      <main className="contenu">
        <p>Bienvenue ! Cette application vous aide a trouver votre ligne de bus a Dakar</p>
        <h3>Statistiques</h3>
        <Statistique/>
        <Statistique1/>
        <Statistique2/>
      </main>
      <Footer/>
    </div>
  );
}

export default App;