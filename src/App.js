import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [chargementDetail, setChargementDetail] = useState(false);
  const [erreurDetail, setErreurDetail] = useState(null);

  const chargerLignes = () => {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  };

  useEffect(() => {
    chargerLignes();
  }, []);

  const chargerDetailLigne = (ligneId) => {
    // On réinitialise l'état du détail
    setLigneSelectionnee(null);
    setErreurDetail(null);
    setChargementDetail(true);

    fetch(`http://localhost:5000/lignes/${ligneId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setLigneSelectionnee(data);
        setChargementDetail(false);
      })
      .catch(error => {
        setErreurDetail(error.message);
        setChargementDetail(false);
      });
  };

  const handleClickLigne = (ligne) => {
    // Si c'est la même ligne déjà sélectionnée, on la désélectionne
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
      setErreurDetail(null);
    } else {
      // Sinon on charge les détails depuis l'API
      chargerDetailLigne(ligne.id);
    }
  };

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
          <button className="bouton-recharger" onClick={chargerLignes}>
            Recharger
          </button>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            <button className="bouton-recharger" onClick={chargerLignes}>
              Recharger
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />
        <div className="barre-actions">
          <button className="bouton-recharger" onClick={chargerLignes}>
            ⟳ Recharger
          </button>
        </div>
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''}{' '}
          trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}  // ici c'est juste le nombre d'arrêts, pas la liste
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {/* Affichage du détail avec gestion du chargement et erreur */}
        {chargementDetail && (
          <div className="message-chargement-detail">
            Chargement des détails...
          </div>
        )}
        {erreurDetail && (
          <div className="message-erreur-detail">
            Erreur lors du chargement des détails : {erreurDetail}
          </div>
        )}
        {ligneSelectionnee && !chargementDetail && !erreurDetail && (
          <DetailLigne ligne={ligneSelectionnee} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;