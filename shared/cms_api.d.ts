
// CMI_API_Response: Ce type est une enveloppe de base pour toutes les réponses du CMS.
// Il permet de vérifier si la requête s'est bien passée (code = 200, status = "ok").
// Avant de lire les données, on regarde ces deux champs pour éviter les erreurs.


type CMS_API_Response = {
    code: number,
    status: 'ok' | string,
}

type CMS_API_Image = {
    "extension": string,
    "filename": string,
    "height": number,
    "id": string,
    "mime": string,
    "niceSize": "951 B",
    "template": "",
    "type": "image",
    "url": "http://localhost:8000/media/pages/home/0a94594deb-1751548581/capture-decran-2025-07-03-a-15.14.47-50x-q10.png",
    "width": 50
}
