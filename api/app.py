import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les données depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

with open("arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)


@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })


@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)


@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

# Exercice 1 : GET /arrets


# Exercice 2 : GET /stats
@app.route("/stats")
def get_stats():
    nombre_lignes = len(lignes)
    total_arrets = sum(ligne["arrets"] for ligne in lignes)
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    return jsonify({
        "nombre_total_lignes": nombre_lignes,
        "somme_totale_arrets": total_arrets,
        "ligne_avec_plus_arrets": {
            "id": ligne_max["id"],
            "numero": ligne_max["numero"],
            "arrets": ligne_max["arrets"]
        }
    })

# Exercice 3 : GET /lignes/recherche?q=...
@app.route("/lignes/recherche")
def recherche_lignes():
    q = request.args.get("q", "").lower()
    if not q:
        return jsonify({"erreur": "Paramètre 'q' manquant"}), 400
    resultats = [
        ligne for ligne in lignes
        if q in ligne["depart"].lower() or q in ligne["arrivee"].lower()
    ]
    return jsonify(resultats)

if __name__ == "__main__":
    app.run(debug=True, port=5000)