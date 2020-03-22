from randomuser import RandomUser
from python_graphql_client import GraphqlClient
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

randomUser = []

user_list = RandomUser.generate_users(10, {'nat': 'de'})

for user in user_list:
    randomUserProperties = {}
    randomUserProperties["first_name"] = user.get_first_name()
    randomUserProperties["last_name"] = user.get_last_name()
    randomUserProperties["phone_number"] = user.get_phone()
    randomUserProperties["street"] = user.get_street()
    randomUserProperties["zip_code"] = user.get_zipcode()
    randomUserProperties["city"] = user.get_city()

    randomUser.append(randomUserProperties)

    client = GraphqlClient(
        endpoint='http://95.217.162.167:8080/v1/graphql')
    variables = {"first_name": randomUserProperties["first_name"], "last_name": randomUserProperties["last_name"],
                 "phone_number": randomUserProperties["phone_number"], "street": randomUserProperties["street"], "zip_code": randomUserProperties["zip_code"], "city": randomUserProperties["city"]}
    insertQuery = """
        mutation insertUsers($first_name: String, $last_name: String, $phone_number: String, $street: String, $zip_code: Int, $city: String) {
            insert_users(objects: {first_name: $first_name, last_name: $last_name, phone_number: $phone_number, street: $street, zip_code: $zip_code, city: $city}) {
                affected_rows
            }
        }
    """

    graphQlResult = client.execute(insertQuery, variables)
    print(graphQlResult)
