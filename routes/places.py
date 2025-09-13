import requests

def getReviews():
    return requests.get('https://places.googleapis.com/v1/places/PLADE_ID?fields=reviews&key=API_KEY').json()