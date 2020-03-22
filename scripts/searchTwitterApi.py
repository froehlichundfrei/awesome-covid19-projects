import json
from twython import Twython
from python_graphql_client import GraphqlClient
import os

siteObjects = []


def searchTwitter(siteObjects):
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
        siteObjectProperties["siteUrl"] = hasuraSiteEntrie["url"]
        python_tweets = Twython(
            os.getenv('CONSUMER_KEY'), os.getenv('CONSUMER_SECRET'))
        query = {'q': siteObjectProperties["siteUrl"],
                 'result_type': 'popular',
                 'count': 10,
                 'lang': 'de',
                 }
        results = python_tweets.search(**query)
        try:
            tweetId = results["statuses"][0]["id"]
            print(siteObjectProperties["siteUrl"])
            tweetDetails = python_tweets.show_status(id=tweetId)
            print("RetweetCount: ", tweetDetails["retweet_count"])
            print("Like Count: ", tweetDetails["favorite_count"])
            tweetRankingCount = tweetDetails["retweet_count"] + \
                tweetDetails["favorite_count"]
            print("Ranking Count: ", tweetRankingCount)
            # sleep(100)
        except:
            print("not working")
        try:
            client = GraphqlClient(
                endpoint='http://95.217.162.167:8080/v1/graphql')
            variables = {
                "url": siteObjectProperties["siteUrl"], "twitterActions": tweetRankingCount}
            updateQuery = """
                mutation updateProject($url: String, $twitterActions: Int) {
                    update_projects(where: {url: {_eq: $url}}, _set: {twitterActions: $twitterActions}) {
                        affected_rows
                    }
                }
            """
            graphQlResult = client.execute(updateQuery, variables)
            print(graphQlResult)
        except:
            print("GraphQL Import Error")
            print("Parsing Error - Ignore URL: ", hasuraSiteEntrie["url"])
        siteObjects.append(siteObjectProperties)
    return siteObjects


# searchTwitter(siteObjects)
