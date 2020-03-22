from python_graphql_client import GraphqlClient
from bs4 import BeautifulSoup
import requests

siteObjects = []


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

            r = requests.get(siteObjectProperties["siteUrl"])
            soup = BeautifulSoup(r.content, "html")
            if soup.title.string == "":
                siteObjectProperties["siteMetaTitle"] = "Not set"
            else:
                siteObjectProperties["siteMetaTitle"] = soup.title.string

            meta = soup.find_all('meta')
            if len(meta) == 0:
                siteObjectProperties["siteMetaDescription"] = "Not set"
            else:
                for tag in meta:
                    if 'name' in tag.attrs.keys() and tag.attrs['name'].strip().lower() in ['description']:
                        # print('NAME:', tag.attrs['name'].lower())
                        siteObjectProperties["siteMetaDescription"] = tag.attrs['content']
        except:
            print("Parsing Error - Ignore URL: ", hasuraSiteEntrie["url"])
        siteObjects.append(siteObjectProperties)

    return siteObjects


getSiteUrlsFromHasura(siteObjects)


def upsertSiteMetaInformationToHasura(siteObjects):
    for siteObject in siteObjects:
        try:
            client = GraphqlClient(
                endpoint='http://95.217.162.167:8080/v1/graphql')
            variables = {"url": siteObject["siteUrl"], "siteMetaTitle": siteObject["siteMetaTitle"],
                         "siteMetaDescription": siteObject["siteMetaDescription"]}
            updateQuery = """
                mutation updateProject($url: String, $siteMetaTitle: String, $siteMetaDescription: String) {
                    update_projects(where: {url: {_eq: $url}}, _set: {title: $siteMetaTitle, description: $siteMetaDescription}) {
                        affected_rows
                    }
                }
            """
            graphQlResult = client.execute(updateQuery, variables)
            print(graphQlResult)
        except:
            print("GraphQL Import Error for URL: ", siteObject["siteUrl"])
        """
        if graphQlResult["errors"][0]["message"] == ('Uniqueness violation. duplicate key value violates unique constraint "projects_url_key"'):
            graphQlResult = client.execute(updateQuery, variables)
            print(graphQlResult)
        """


upsertSiteMetaInformationToHasura(siteObjects)
