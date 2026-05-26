import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Corriger les icônes Leaflet par défaut (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icône personnalisée pour l'arrêt le plus proche (orange)
const iconeProche = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconeDefaut = L.Icon.Default.prototype;

// Composant bouton centrer
function CentrerBouton({ position }) {
  const map = useMap();
  if (!position) return null;
  return (
    <button className="bouton-centrer" onClick={() => map.setView(position, 15)}>
        Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretsProches, setArretsProches] = useState([]); // Tableau des 3 plus proches
  const DAKAR = [14.6928, -17.4467];

  // Charger les arrêts depuis Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets :", err));
  }, []);

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setPositionUtilisateur([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("Géolocalisation refusée")
      );
    }
  }, []);

  // Trouver les 3 arrêts les plus proches
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      const avecDistances = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0],
          positionUtilisateur[1],
          a.lat,
          a.lon
        )
      }));
      const tries = avecDistances.sort((a, b) => a.distance - b.distance);
      const troisPlusProches = tries.slice(0, 3);
      setArretsProches(troisPlusProches);
    } else {
      setArretsProches([]);
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrêts</h2>

      {/* Liste des 3 arrêts les plus proches */}
      {positionUtilisateur && arretsProches.length > 0 && (
        <div className="liste-proches">
          <h3>3 arrêts les plus proches de vous</h3>
          <ul>
            {arretsProches.map((a, index) => (
              <li key={a.id}>
                <span className="rang">{index + 1}.</span>
                <strong>{a.nom}</strong> – {a.distance.toFixed(2)} km
                {index === 0 && <span className="plus-proche-badge"> (le plus proche)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {arrets.map(a => {
          // L'arrêt le plus proche = premier du tableau (s'il existe)
          const estPlusProche = arretsProches.length > 0 && a.id === arretsProches[0].id;
          return (
            <Marker
              key={a.id}
              position={[a.lat, a.lon]}
              icon={estPlusProche ? iconeProche : iconeDefaut}
            >
              <Popup>
                <strong>{a.nom}</strong><br />
                Lignes : {a.lignes.join(", ")}
                {estPlusProche && <div style={{ color: 'orange' }}>Arrêt le plus proche</div>}
              </Popup>
            </Marker>
          );
        })}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}
        <CentrerBouton position={positionUtilisateur} />
      </MapContainer>
    </div>
  );
}

export default Carte;