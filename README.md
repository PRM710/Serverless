# Serverless

- Must have own AWS account to having "sendemail" function having the specific code
```
import boto3
import logging
import os  # for accessing environment variables

# Configure logging (replace with your desired configuration)
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logging.basicConfig(stream=sys.stdout)  # Example: Log to stdout

def lambda_handler(event, context):
    """Lambda function to send emails using Amazon SES."""

    # Access sender email address from environment variable (replace placeholder)
    sender_email = os.environ['SES_FROM_EMAIL']

    # Extract recipient, subject, and body text from event (if present)
    recipient = event.get('recipient')
    subject = event.get('subject')
    body_text = event.get('body_text')

    # Basic input validation
    if not all([recipient, subject, body_text]):
        logger.error("Missing required fields: recipient, subject, or body_text")
        return {
            'statusCode': 400,
            'body': 'Missing required information for sending email.'
        }

    try:
        # Create SES client
        ses_client = boto3.client("ses")

        # Send email
        response = ses_client.send_email(
            Destination={
                "ToAddresses": [
                    recipient,
                ]
            },
            Message={
                "Body": {
                    "Text": {
                        "Charset": "UTF-8",
                        "Data": body_text,
                    }
                },
                "Subject": {
                    "Charset": "UTF-8",
                    "Data": subject,
                }
            },
            Source=sender_email,
        )

        logger.info(f"Email sent successfully. Message ID: {response['MessageId']}")
        return {
            'statusCode': 200,
            'body': 'Email sent successfully.'
        }

    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return {
            'statusCode': 500,
            'body': 'An error occurred while sending email.'
        }


```
- Must have I AM ROLE named "Serverless"
- Must set-up the "Serverless" credentials set up through terminal (or create an environment)
- Account on Serverless.com

