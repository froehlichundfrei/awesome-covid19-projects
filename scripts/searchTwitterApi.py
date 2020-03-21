import json

def storeCredentials():
    credentials = {}
    credentials['CONSUMER_KEY'] = ""
    credentials['CONSUMER_SECRET'] = ""
    credentials['ACCESS_TOKEN'] = ""
    credentials['ACCESS_SECRET'] = ""

    with open("/Users/philipp.buck/Desktop/twitter_credentials.json", "w") as file:
        json.dump(credentials, file)

def searchTwitter():
    from twython import Twython
    import json

    with open("/Users/philipp.buck/Desktop/twitter_credentials.json", "r") as file:
        creds = json.load(file)

    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])

    query = {'q': 'wirhelfen.eu',
            'result_type': 'popular',
            'count': 10,
            'lang': 'de',
            }
    results = python_tweets.search(**query)
    print(results)

searchTwitter()