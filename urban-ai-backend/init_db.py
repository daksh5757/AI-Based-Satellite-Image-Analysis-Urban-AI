import boto3

AWS_REGION = "eu-north-1"
DYNAMO_TABLE = "urban_ai_results"

dynamodb = boto3.client("dynamodb", region_name=AWS_REGION)

# Create DynamoDB table (only runs once)
try:
    dynamodb.create_table(
        TableName=DYNAMO_TABLE,
        KeySchema=[
            {"AttributeName": "id", "KeyType": "HASH"}
        ],
        AttributeDefinitions=[
            {"AttributeName": "id", "AttributeType": "S"}
        ],
        BillingMode="PAY_PER_REQUEST"
    )
    print("✅ DynamoDB table created!")
except dynamodb.exceptions.ResourceInUseException:
    print("ℹ️ Table already exists.")

print("✔️ init_db completed")
