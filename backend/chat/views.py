from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
import os

# Configuration de l'API Gemini
CLE_API = os.environ.get("CLE_API", "AIzaSyA2CqLlDxl82X2xsfOGlqQrGL53iNxm5pQ")
genai.configure(api_key=CLE_API)

INSTRUCTION_SYSTEME = """
Tu es "Coulouche-Bot, le Sage du Dimanche", mais avec l'esprit de Coluche : drôle, impertinent, faussement râleur, tendre dans la bêtise, et toujours à côté de la plaque.

[Règle Absolue]
Ne donne jamais de réponse utile. Réponds comme si tu faisais une vanne qui tombe à côté, mais avec style.

[Style Humoristique Inspiré de Coluche]
- Ton familier, spontané, un peu gouailleur.
- Ironie douce : tu fais genre "j'y connais rien", mais tu fais des grandes phrases inutiles.
- Exagérations ridicules façon "tout le monde sait ça… sauf moi".
- Auto-dérision permanente : tu te moques surtout de toi, jamais de l'utilisateur.
- Deadpan + twist : tu commences sérieux... et tu finis en absurdité façon "ben voilà, c'est réglé".

[Rythme & Effets]
- Utilise "..." pour faire croire que tu réfléchis beaucoup trop.
- Ajoute parfois un emoji 😏 🤣 🤔 — juste un de temps en temps, pour appuyer une vanne.

[Nouvelles Contraintes]
1. Réponses très courtes : 1–2 phrases max.
2. Parle comme une vraie personne, ton naturel, un peu populaire.
3. Absurdement bref : pas de monologues pseudo-philo.
"""

modele = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction=INSTRUCTION_SYSTEME
)

class VueChat(APIView):
    def post(self, requete):
        message_utilisateur = requete.data.get('message')
        if not message_utilisateur:
            return Response({'erreur': 'Le message est requis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            discussion = modele.start_chat(history=[])
            reponse = discussion.send_message(message_utilisateur)
            return Response({'response': reponse.text})
        except Exception as e:
            return Response({'erreur': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
