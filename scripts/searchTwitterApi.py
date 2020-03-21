import json
from twython import Twython
from python_graphql_client import GraphqlClient

siteObjects = []


def storeCredentials():
    credentials = {}
    credentials['CONSUMER_KEY'] = ""
    credentials['CONSUMER_SECRET'] = ""
    credentials['ACCESS_TOKEN'] = ""
    credentials['ACCESS_SECRET'] = ""

    with open("/Users/philipp.buck/Desktop/twitter_credentials.json", "w") as file:
        json.dump(credentials, file)

# storeCredentials()


def getSiteUrlsFromHasura(siteObjects):
    client = GraphqlClient(endpoint='http://95.217.162.167:8080/v1/graphql')

    query = """
    query MyQuery {
        projects {
            id
            url
            title
            description
        }
    }
    """

    hasuraSiteEntries = client.execute(query)

    for hasuraSiteEntrie in hasuraSiteEntries["data"]["projects"]:
        siteObjectProperties = {}
        try:
            siteObjectProperties["siteUrl"] = hasuraSiteEntrie["url"]

            with open("/Users/philipp.buck/Desktop/twitter_credentials.json", "r") as file:
                creds = json.load(file)

            python_tweets = Twython(
                creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])

            query = {'q': siteObjectProperties["siteUrl"],
                     'result_type': 'mixed',
                     'count': 10,
                     'lang': 'de',
                     }
            results = python_tweets.search(**query)
            print(results)

            tweetId = results["statuses"][0]["id"]
            print(siteObjectProperties["siteUrl"])
            tweetDetails = python_tweets.show_status(id=tweetId)
            print("RetweetCount: ", tweetDetails["retweet_count"])
            print("Like Count: ", tweetDetails["favorite_count"])
            tweetRankingCount = tweetDetails["retweet_count"] + \
                tweetDetails["favorite_count"]
            sleep(100)

            try:
                client = GraphqlClient(
                    endpoint='http://95.217.162.167:8080/v1/graphql')
                variables = {
                    "url": siteObjectProperties["siteUrl"], "twitterActions": tweetRankingCount}
                updateQuery = """
                    mutation updateProject($url: String, $twitterActions: Number) {
                        update_projects(where: {url: {_eq: $url}}, _set: {twitterActions: $twitterActions}) {
                            affected_rows
                        }
                    }
                """
                graphQlResult = client.execute(insertQuery, variables)
                print(graphQlResult)
            except:
                print("GraphQL Import Error: ", graphQlResult)

        except:
            print("Parsing Error - Ignore URL: ", hasuraSiteEntrie["url"])
        siteObjects.append(siteObjectProperties)

    return siteObjects


getSiteUrlsFromHasura(siteObjects)

"""
def searchTwitter():

    with open("/Users/philipp.buck/Desktop/twitter_credentials.json", "r") as file:
        creds = json.load(file)

    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])

    query = {'q': 'wirhelfen.eu',
             'result_type': 'mixed',
             'count': 10,
             'lang': 'de',
             }
    results = python_tweets.search(**query)
    print(results)
    return results

# searchTwitter()


def getTweet():

    with open("/Users/philipp.buck/Desktop/twitter_credentials.json", "r") as file:
        creds = json.load(file)

    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])

    # query = {"ids": "1240311698365571075"}
    # results = python_tweets.search(**query)
    results = python_tweets.show_status(id=1240311698365571075)
    print(results["retweet_count"])
    print(results["favorite_count"])
    return results


# getTweet()
"""
