import './ListeLignes.css';

function StatReseau({lignes}){
    const totalLignes = lignes.length;

    let totalArrets = 0;
    for (let i = 0; i < lignes.length; i++) {
        totalArrets = totalArrets + lignes[i].arrets;
    }

    let ligneMax = lignes[0];
    for (let i = 1; i < lignes.length; i++) {
        if (lignes[i].arrets > ligneMax.arrets) {
        ligneMax = lignes[i];
        }
    }
    
    return(
        <div>
            <span>{lignes.length} lignes disponibles ● </span>
            <span>{totalArrets} arrêts au total ● </span>
            <span>Ligne ayant le plus d'arrêts: {ligneMax.numero} ({ligneMax.arrets} arrêts)</span>
        </div>
    );
}

export default StatReseau;