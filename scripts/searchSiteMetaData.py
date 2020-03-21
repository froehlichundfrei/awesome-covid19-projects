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

    siteObject = {}
    for hasuraSiteEntrie in hasuraSiteEntries["data"]["projects"]:
        siteObject["siteUrl"] = hasuraSiteEntrie["url"]
        siteObjects.append(siteObject)

    return siteObjects


getSiteUrlsFromHasura(siteObjects)


def getMetaInformation(siteObjects):

    for siteObject in siteObjects:
        r = requests.get(siteObject["siteUrl"])
        soup = BeautifulSoup(r.content, "html")

        siteObject["siteMetaTitle"] = soup.title.string

        meta = soup.find_all('meta')

        for tag in meta:
            if 'name' in tag.attrs.keys() and tag.attrs['name'].strip().lower() in ['description']:
                #print('NAME:', tag.attrs['name'].lower())
                siteObject["siteMetaDescription"] = tag.attrs['content']

    siteObjects.append(siteObject)
    # print(siteObjects)
    return siteObjects


getMetaInformation(siteObjects)


def upsertSiteMetaInformationToHasura(siteObjects):
    for siteObject in siteObjects:
        client = GraphqlClient(
            endpoint='http://95.217.162.167:8080/v1/graphql')
        variables = {"url": siteObject["siteUrl"], "siteMetaTitle": siteObject["siteMetaTitle"],
                     "siteMetaDescription": siteObject["siteMetaDescription"]}
        insertQuery = """
            mutation insertProject($url: String, $siteMetaTitle: String, $siteMetaDescription: String) {
                insert_projects(objects: {url: $url, title: $siteMetaTitle, description: $siteMetaDescription}) {
                    affected_rows
                }
            }
        """
        updateQuery = """
            mutation updateProject($url: String, $siteMetaTitle: String, $siteMetaDescription: String) {
                update_projects(where: {url: {_eq: $url}}, _set: {title: $siteMetaTitle, description: $siteMetaDescription}) {
                    affected_rows
                }
            }
        """
        graphQlResult = client.execute(insertQuery, variables)
        print("Insert: ")
        print(graphQlResult)
        if graphQlResult["errors"][0]["message"] == ('Uniqueness violation. duplicate key value violates unique constraint "projects_url_key"'):
            graphQlResult = client.execute(updateQuery, variables)
            print("Update: ")
            print(graphQlResult)


upsertSiteMetaInformationToHasura(siteObjects)
