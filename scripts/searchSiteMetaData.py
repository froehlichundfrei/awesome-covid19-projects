from bs4 import BeautifulSoup
import requests

siteUrl = 'https://www.bundesregierung.de/'

def getMetaInformation(siteUrl):
    r = requests.get(siteUrl)
    soup = BeautifulSoup(r.content, "html")

    title = soup.title.string
    print('TITLE:', title)

    meta = soup.find_all('meta')

    for tag in meta:
        if 'name' in tag.attrs.keys() and tag.attrs['name'].strip().lower() in ['description', 'keywords']:
            print ('NAME:',tag.attrs['name'].lower())
            print ('CONTENT :',tag.attrs['content'])

getMetaInformation(siteUrl)