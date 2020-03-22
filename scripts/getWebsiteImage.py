import asyncio
from pyppeteer import launch
from python_graphql_client import GraphqlClient
from minio import Minio
from minio.error import ResponseError
# requires manuall installation of git repo in python 3.8
# python3 -m pip install -U git+https://github.com/miyakogi/pyppeteer.git@dev
minioClient = Minio('95.217.162.167:9000',
                  access_key='minio',
                  secret_key='awsomeCov19',
                  secure=False)
async def main(url, imageName):
    browser = await launch(args=['--no-sandbox'])
    page = await browser.newPage()
    try:
        await page.goto(url)
        await page.screenshot({'path': imageName})
        await browser.close()
    except:
        print("timeout reached")
client = GraphqlClient(endpoint='http://95.217.162.167:8080/v1/graphql')
query = """
query MyQuery {
    projects{
        id
        url
    }
}
"""
hasuraSiteEntries = client.execute(query)
siteObject = {}

for hasuraSiteEntrie in hasuraSiteEntries["data"]["projects"]:
    url = hasuraSiteEntrie["url"]
    imageName = str(hasuraSiteEntrie["id"]) + ".png"
    asyncio.get_event_loop().run_until_complete(main(url, imageName))
    try:
      print(url)
      print(imageName)
      minioClient.fput_object('webimages', imageName, imageName)
    except:
      print('ignore every fucking error')




